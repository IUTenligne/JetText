var React = require('react');
var Constants = require('../constants');
var Loader = require('../widgets/Loader.jsx');
var NotificationSystem = require('react-notification-system');
var Modal = require('../widgets/Modal.jsx');
var Tooltip = require('../widgets/Tooltip.jsx');
var ContainersList = require('./ContainersList.jsx');


var TextBlock = React.createClass({
	getInitialState: function() {
        return {
            changeName: false,
            blockName: '',
            blockContent: '',
            blockVirtualContent: '',
            loading: false,
            termsList: [],
            formulaModalState: false,
            helpModalState: false,
            formulaString: '',
            getEditor: '',
            selectedText: '',
            containersGlossariesList: [],
            editBlock: true,
            tooltipState: false,
            tooltipMovesState: false
        };
    },

    componentDidMount: function() {
        this.setState({ 
            blockName: this.props.block.name,
            blockContent: this.props.block.content
        });

        this.serverRequest = $.get("/containers_glossaries/" + this.props.containerId +  ".json", function(result){
            this.setState({
                containersGlossariesList: result.containers_glossaries,
                blockContent: this.props.block.content
            });

            if (result.containers_glossaries.length > 0) {
                for (var i in result.containers_glossaries) {
                    /* blockVirtualContent is a copy of blockContent, used to display a list of glossary terms
                    and to not override the block's content by adding <a> links in the database.
                    Only used in the client-side to display a term description in a tooltip if a glossary is checked. */

                    this.serverRequest = $.get("/glossaries/" + result.containers_glossaries[i]["glossary_id"] + ".json", function(result){
                        this.setState({
                            termsList: this.state.termsList.concat(result.terms),
                            blockVirtualContent: this.regexTerm(this.state.termsList.concat(result.terms), this.props.block.content)
                        });
                    }.bind(this));
                }

                this.setState({
                    blockVirtualContent: this.regexTerm(this.termsList, this.props.block.content)
                });
            }
        }.bind(this));

        this._notificationSystem = this.refs.notificationSystem;

        /* Opens CKEditor if the block has no content */
        if ((this.props.block.content == '') || (this.props.block.content == null)) {
            this.unlockEditor();
        }
    },

    regexTerm: function(termsList, content){
        for ( var i in termsList ) {
            var regex = new RegExp(termsList[i]["name"], "gi");
            if ( content.match(regex) ) {
                content = content.replace(regex, '<a href="#" data="'+termsList[i]["description"]+'">'+termsList[i]["name"]+'</a>');
            }
        }
        return content;
    },

    componentWillUnmount: function() {
        var editor = CKEDITOR.instances["text_block_"+this.props.block.id];

        /* Saves the block's content if before leaving the page */
        this.saveBlock(this.props.block.id, this.state.blockName, this.state.blockContent);
        if (editor) { editor.destroy(true); }
        this.serverRequest.abort();
    },

    saveBlock: function(id, name, content) {
        var block = { id: id, name: name, content: content };
        this.props.saveBlock(block);
        this.setState({ editBlock: true });
        var editor = CKEDITOR.instances["text_block_"+this.props.block.id];
        if (editor) { editor.destroy(true); }
    },

    saveDraft: function(id, name, content) {
        var block = { id: id, name: name, content: content };
        this.props.saveBlock(block);
    },

    unlockEditor: function() {
        for (name in CKEDITOR.instances) {
            /* avoid CKE instances conflicts */
            CKEDITOR.instances[name].destroy(true);
        }

        var that = this;

        var editor = CKEDITOR.replace("text_block_"+this.props.block.id, {
            customConfig: '/assets/cke/custom_config.js'
        });

        editor.setData(this.state.blockContent);

        var saveDraft;

        editor.on('change', function( evt ) {
            /* Clears the timeout function on change to avoid multiple PUT requests */
            clearTimeout(saveDraft);

            var content = that._highlightText(evt.editor.getData(), editor);
            that.setState({
                blockContent: content,
                blockVirtualContent: that.regexTerm(that.state.termsList, content),
            });

            /* Automatically saves the block content after change */
            saveDraft = setTimeout(function(){
                that.saveDraft(that.props.block.id, that.state.blockName, that.state.blockContent);
            }, Constants.DRAFT_TIMER);
        });

        this.setState({ focusPopup: false, editBlock: false });
    },

    _highlightText: function(query, editor) {
        if ( query.match(/{{(.*?)}}/) ) {
            var extract = query.match(/{{(.*?)}}/).pop();
            var formula = extract.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            var content = query.replace(/{{(.*?)}}/, '<span class="formula">' + formula + '</span>');

            this.setState({
                getEditor: editor,
                formulaString: formula,
                blockContent: content,
                formulaModalState: true
            });
        } else {
            this.setState({
                blockContent: query
            })
        }

        return this.state.blockContent;
    },

    handleFormulaModalState: function(st) {
        this.setState({ formulaModalState: st });
    },

    handleFormulaChange: function(event) {
        this.setState({ formulaString: event.target.value });
    },

    saveFormula: function() {
        var editor = this.state.getEditor;
        var newData = this.state.blockContent;
        editor.setData(newData);

        this.setState({
            formulaModalState: false,
            blockContent: newData
        });

        this.saveBlock();
    },

    _notificationSystem: null,

    dynamicId: function(id){
        return "text_block_" + id;
    },

    createMarkup: function(data) {
        return {__html: data};
    },

    handleBlockAdd: function(data) {
        /* updates the block list after a duplication on the same page */
        this.props.addBlock(data);
    },

    handleBlockName: function(event) {
        this.setState({
            blockName: event.target.value,
            changeName: true
        });
    },

    viewBlockAction: function() {
        this.setState({ 
            tooltipState: !this.state.tooltipState,
            tooltipMovesState: false
        });
    },

    viewBlockMoves: function() {
        this.setState({ 
            tooltipState: false,
            tooltipMovesState: !this.state.tooltipMovesState
        });
    },

    handleTooltipState: function(st) {
        this.setState({ tooltipState: st });
    },

    handleTooltipMovesState: function(st) {
        this.setState({ tooltipMovesState: st });
    },

    handleRemoveBlock: function() {
        this.props.removeBlock(this.props.block);
    },

    handleHelpModalState: function() {
        this.setState({ helpModalState: !this.state.helpModalState });
    },

    exportBlock: function() {
        this.props.exportBlock();
    },

    moveUpBlock: function() {
        this.props.moveBlock("up");
    },

    moveDownBlock: function() {
        this.props.moveBlock("down");
    },

	render: function() {
		var block = this.props.block;

		return (
            <div className="block-inner">
                <div className="block-inner-content" key={block.id}>
                    <div className="block-title">
                        <i className="fa fa-pencil" onClick={this.unlockEditor}></i>
                        <h3>
                            <input ref="textblockname" type="text" value={this.state.blockName ? this.state.blockName : ''} placeholder="Titre..." onChange={this.handleBlockName}/>
                            { this.state.changeName 
                                ? <button 
                                    title="Enregister" 
                                    onClick={this.saveBlock.bind(this, this.props.block.id, this.state.blockName, this.state.blockContent)}>
                                    <i className="fa fa-check"></i>
                                </button> 
                                : null 
                            }
                        </h3>
                    </div>

                    { this.state.blockVirtualContent != ''
                        ? <div
                            id={this.dynamicId(block.id)}
                            className="block-content"
                            ref="editableblock"
                            dangerouslySetInnerHTML={this.createMarkup(this.state.blockVirtualContent)}
                            onDoubleClick={this.unlockEditor}
                        />
                        : <div
                            id={this.dynamicId(block.id)}
                            className="block-content"
                            ref="editableblock"
                            dangerouslySetInnerHTML={this.createMarkup(this.state.blockContent)}
                            onDoubleClick={this.unlockEditor}
                        />
                    }

                    { this.state.editBlock 
                        ? null 
                        : <div className="block-save">
                            <button 
                                className="text-block-save" 
                                title="Enregister" 
                                onClick={this.saveBlock.bind(this, this.props.block.id, this.state.blockName, this.state.blockContent)}>
                                <i className="fa fa-check"></i>
                            </button>
                        </div> 
                    }
                </div>


                { this.state.formulaModalState
                    ? <Modal active={this.handleFormulaModalState} mystyle={""} title={"Ajouter une formule"}>
                        <div>
                            <input type="text" value={this.state.formulaString} onChange={this.handleFormulaChange} />
                            <input type="submit" value="Ok" onClick={this.saveFormula} />
                        </div>
                    </Modal>
                    : null
                }

                { this.state.helpModalState
                    ? <Modal active={this.handleHelpModalState} mystyle={""} title={"Aide pour le bloc Texte"}>
                            <div className="modal-in">
                                Activer le mode édition : 
                                <ul>
                                    <li>double cliquer sur le contenu du bloc,</li>
                                    <li>ou cliquer sur l'icône <i className="fa fa-pencil"></i> dans l'entête du bloc,</li>
                                    <li>ou à partir du menu du bloc <i className="fa fa-cog"></i>.</li>
                                </ul>
                            </div>
                        </Modal>
                    : null
                }

                <div className="action">
                    <i className="fa fa-cog" title="Paramètre" onClick={this.viewBlockAction} ></i>
                    <i className="fa fa-question-circle" title="Aide" onClick={this.handleHelpModalState} ></i>
                    <button className="handle" title="Déplacer le bloc" onClick={this.viewBlockMoves}></button>
                </div>

                <Tooltip tooltipState={this.handleTooltipState}>
                    { this.state.tooltipState
                        ? <div className="block-actions">
                            { this.state.editBlock
                                ? <button className="text-block-edit" onClick={this.unlockEditor}><i className="fa fa-pencil"></i> Editer</button>
                                : <button 
                                    className="text-block-save" 
                                    onClick={this.saveBlock.bind(this, this.props.block.id, this.state.blockName, this.state.blockContent)}>
                                    <i className="fa fa-check"></i> Enregistrer
                                </button>
                            }
                            <br/>
                            <button className="btn-block" onClick={this.exportBlock}><i className="fa fa-files-o"></i> Dupliquer</button>
                            <br/>
                            <button className="btn-block" onClick={this.handleRemoveBlock}><i className="fa fa-remove"></i> Supprimer</button><br/>
                        </div>
                        : null
                    }
                </Tooltip>

                <Tooltip tooltipState={this.handleTooltipMovesState}>
                    { this.state.tooltipMovesState
                        ? <div className="block-actions block-moves">
                            <button className="btn-block" onClick={this.moveUpBlock}><i className="fa fa-chevron-up"></i> Monter</button><br/>
                            <button className="btn-block" onClick={this.moveDownBlock}><i className="fa fa-chevron-down"></i> Descendre</button><br/>
                            <NotificationSystem ref="notificationSystem" />
                        </div>
                        : null
                    }
                </Tooltip>

                <NotificationSystem ref="notificationSystem"/>
            </div>
        );
	}
});

module.exports = TextBlock;
