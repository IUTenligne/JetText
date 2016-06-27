var React = require('react');
var Constants = require('../constants');
var Loader = require('../widgets/Loader.jsx');
var NotificationSystem = require('react-notification-system');
var Modal = require('../widgets/Modal.jsx');
var Tooltip = require('../widgets/Tooltip.jsx');
var ContainersList = require('./ContainersList.jsx');


var NoteBlock = React.createClass({
	getInitialState: function() {
        return {
            blockName: '',
            blockContent: '',
            blockVirtualContent: '',
            loading: false,
            myStyle: '',
            left: '',
            top: '',
            termsList: [],
            formulaModalState: false,
            helpModalState: false,
            formulaString: '',
            getEditor: '',
            selectedText: '',
            focusPopup: false,
            containersGlossariesList: [],
            selectedStyle: '',
            editBlock: true,
            tooltipState: false,
            tooltipMovesState: false,
            noteStyles: ["remarque", "important", "quote", "exemple", "definition", "methode"]
        };
    },

    componentDidMount: function() {
        this.setState({ blockName: this.props.block.name });

        this.serverRequest = $.get("/containers_glossaries/" + this.props.containerId +  ".json", function(result){
            this.setState({
                containersGlossariesList: result.containers_glossaries,
                blockContent: this.props.block.content
            });

            if (this.props.block.classes != undefined || this.props.block.classes) {
                this.setState({ selectedStyle: this.props.block.classes });
            } else {
                this.setState({ selectedStyle: "important" });
            }

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
            var regex = new RegExp("\\b" + termsList[i]["name"] + "\\b", "gi");
            if ( content.match(regex) ) {
                content = content.replace(regex, '<a href="#" data="'+termsList[i]["description"]+'">'+termsList[i]["name"]+'</a>');
            }
        }
        return content;
    },

    componentWillUnmount: function() {
        var editor = CKEDITOR.instances["note_block_"+this.props.block.id];
        if (editor) { editor.destroy(true); }
    },

    saveBlock: function(id, name, content, classes) {
        var block = { id: id, name: name, content: content, classes: classes };
        this.props.saveBlock(block);
        this.setState({ editBlock: true });
        var editor = CKEDITOR.instances["note_block_"+this.props.block.id];
        if (editor) { editor.destroy(true); }
    },

    saveDraft: function(id, name, content, classes) {
        var block = { id: id, name: name, content: content, classes: classes };
        this.props.saveBlock(block);
    },

    unlockEditor: function() {
        for (name in CKEDITOR.instances) {
            /* avoid CKE instances conflicts */
            CKEDITOR.instances[name].destroy(true);
        }

        var that = this;

        var editor = CKEDITOR.replace("note_block_"+this.props.block.id, {
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
                that.saveDraft(that.props.block.id, that.state.blockName, that.state.blockContent, that.state.selectedStyle);
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

    handleBlockAdd: function(data) {
        /* updates the block list after a duplication on the same page */
        this.props.addBlock(data);
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
        return "note_block_" + id;
    },

    createMarkup: function(data) {
        return {__html: data};
    },

    handleBlockName: function(event) {
        this.setState({
            blockName: event.target.value.trim()
        });

        this.saveDraft(this.props.block.id, event.target.value, this.state.blockContent);
    },

    applyStyle: function(style) {
        $.ajax({
            type: "PUT",
            url: '/blocks/update_classes',
            context: this,
            data: {
                id: this.props.block.id,
                classes: style
            },
            success: function(data) {
                this.setState({ selectedStyle: style });
            }
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
        var myStyle = {
            left: this.state.left + "px",
            top: this.state.top + "px",
            position: "absolute",
            clear: "both"
        };

        var that = this;

		return (
            <div className="block-inner">
                <div className="block-inner-content" key={block.id}>
                    <div className="block-title">
                        <i className="fa fa-quote-right" onClick={this.unlockEditor}></i>
                        <h3>
                            <input ref="noteblockname" type="text" value={this.state.blockName ? this.state.blockName : ''} placeholder="Titre..." onChange={this.handleBlockName}/>
                        </h3>
                    </div>

                    <div className="block-content">
                        <center className="block-note-types">
                            { this.state.noteStyles.map(function(style, i) {
                                return(
                                    <div key={i} className={"note-style " + style} title={style} onClick={that.applyStyle.bind(that, style)}>
                                        <i className={"fa note-icon-" + style + " fa-fw"}></i>
                                    </div>
                                );
                            })}
                        </center>

                        <div className={"block-note block-content-" + this.state.selectedStyle} >
                            <div className={"block-note-title block-note-title-" + this.state.selectedStyle}  >
                                <i className={"fa note-icon-" +  this.state.selectedStyle + " fa-fw"}></i>
                            </div>
                            { this.state.blockVirtualContent != ''
                                ? <div
                                        id={this.dynamicId(block.id)}
                                        ref="editableblock"
                                        dangerouslySetInnerHTML={this.createMarkup(this.state.blockVirtualContent)}
                                        onDoubleClick={this.unlockEditor}
                                    />
                                : <div
                                        id={this.dynamicId(block.id)}
                                        ref="editableblock"
                                        dangerouslySetInnerHTML={this.createMarkup(this.state.blockContent)}
                                        onDoubleClick={this.unlockEditor}
                                    />
                            }
                        </div>
                    </div>
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
                    ? <Modal active={this.handleHelpModalState} mystyle={"help"} title={"Aide"}>
                            <div className="modal-in note">
                                <h4>Block Remarque (En cours d'édition)</h4>
                                Activer le mode édition : 
                                <ul>
                                    <li>double cliquer sur le contenu du bloc,</li>
                                    <li>ou cliquer sur l'icône <i className="fa fa-quote-right"></i> dans l'entête du bloc,</li>
                                    <li>ou à partir du menu du bloc <i className="fa fa-cog"></i>.</li>
                                </ul>
                                Enregistrer le block :
                                <ul>
                                    <li>cliquez sur l'icône <i className="fa fa-check"></i>.</li>
                                </ul>
                            </div>
                        </Modal>
                    : null
                }

                <div className="action">
                    { this.state.editBlock
                        ? <i onClick={this.unlockEditor} title="Editer" className="fa fa-pencil"></i>
                        : <i
                            className="fa fa-check"
                            title="Enregistrer" 
                            onClick={this.saveBlock.bind(this, this.props.block.id, this.state.blockName, this.state.blockContent, that.state.selectedStyle)}>  
                        </i> 
                    }
                    <i className="fa fa-cog" title="Paramètre" onClick={this.viewBlockAction} ></i>
                    <i className="fa fa-question-circle" title="Aide" onClick={this.handleHelpModalState} ></i>
                    <button className="handle" title="Déplacer le bloc" onClick={this.viewBlockMoves}></button>
                </div>

                <Tooltip tooltipState={this.handleTooltipState}>
                    { this.state.tooltipState
                        ? <div className="block-actions">
                            <button className="btn-block" onClick={this.exportBlock.bind(this, block.id)}><i className="fa fa-files-o"></i> Dupliquer</button>
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

module.exports = NoteBlock;
