var React = require('react');
var Loader = require('../widgets/Loader.jsx');
var NotificationSystem = require('react-notification-system');
var Glossaries = require('../glossaries/Glossaries.jsx');
var Term = require('../glossaries/Term.jsx');
var TermOverlay = require('../glossaries/TermOverlay.jsx');
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
            myStyle: '',
            left: '',
            top: '',
            termsList: [],
            glossaryModalState: false,
            formulaModalState: false,
            helpModalState: false,
            formulaString: '',
            getEditor: '',
            selectedText: '',
            focusPopup: false,
            containersGlossariesList: [],
            editBlock: true,
            tooltipState: false,
            modalState: false,
        };
    },

    componentDidMount: function() {
        this.setState({ blockName: this.props.block.name });

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
        var block = this.props.block;
        $.ajax({
            type: "PUT",
            url: '/blocks/'+block.id,
            context: this,
            data: {
                id: block.id,
                name: this.state.blockName,
                content: this.state.blockContent
            }
        });

        if (editor) { editor.destroy(true); }
        this.serverRequest.abort();
    },

    saveBlock: function(close) {
        var block = this.props.block;

        $.ajax({
            type: "PUT",
            url: '/blocks/'+block.id,
            context: this,
            data: {
                id: block.id,
                name: this.state.blockName,
                content: this.state.blockContent
            },
            success: function(data) {
                if (close === true) {
                    this.setState({
                        blockName: data.name,
                        blockContent: data.content,
                        changeName: false,
                        editBlock: true
                    });
                    var editor = CKEDITOR.instances["text_block_"+this.props.block.id];
                    if (editor) { editor.destroy(true); }
                } else {
                    this.setState({
                        blockName: data.name,
                        blockContent: data.content
                    });
                }
            }
        });
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

        editor.on('change', function( evt ) {
            var content = that._highlightText(evt.editor.getData(), editor);
            that.setState({
                blockContent: content,
                blockVirtualContent: that.regexTerm(that.state.termsList, content)
            });
        });

        this.setState({ focusPopup: false, editBlock: false });

        setTimeout(function() {
            that.saveBlock(false);
        }, 2000);
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

        this.saveBlock(true);
    },

    _notificationSystem: null,

    dynamicId: function(id){
        return "text_block_" + id;
    },

    createMarkup: function(data) {
        return {__html: data};
    },

    overTerm: function(event){
        event.preventDefault();

        this.setState({
            selectedText: document.getSelection().toString(),
            left: event.pageX-40,
            top: event.pageY -50
        });

        var txt = document.getSelection().toString();

        if ( (!txt.match(/^\s$/)) && (txt.length > 0) ) {
            this.setState({ focusPopup: true });
        } else {
            this.setState({ focusPopup: false });
        }
    },

    termOverlay: function(){
        this.setState({ glossaryModalState: true });
    },

    handleGlossaryModalState: function(st){
        this.setState({ glossaryModalState: st });
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
        this.setState({ tooltipState: !this.state.tooltipState });
    },

    handleTooltipState: function(st) {
        this.setState({ tooltipState: st });
    },

    handleRemoveBlock: function() {
        this.props.removeMe(this.props.block);
    },

    handleHelpModalState: function() {
        this.setState({ helpModalState: !this.state.helpModalState });
    },

    exportBlock: function() {
        this.setState({
            modalState: true,
            loading: true
        });

        this.getContainers();
    },

    getContainers: function() {
        this.serverRequest = $.get("/containers.json", function(result) {
            this.setState({
                containersList: result.containers,
                loading: false
            });
        }.bind(this));
    },

    handleModalState: function(st) {
        this.setState({ modalState: st });
    },

    closeModal: function() {
        this.setState({ modalState: false });
    },

	render: function() {
		var block = this.props.block;
        var myStyle = {
            left: this.state.left + "px",
            top: this.state.top + "px",
            position: "absolute",
            clear: "both"
        };

		return (
            <div className="block-inner">
                <div className="content" key={block.id} onMouseUp={this.overTerm}>
                    { this.state.focusPopup
                        ? <div className="focus" style={myStyle}>
                            <a onClick={this.termOverlay}>
                                <i className="fa fa-book fa-fw" title="Glossaire" aria-hidden="true"></i>
                            </a>
                        </div>
                        : null
                    }

                    <div className="block-title">
                        <i className="fa fa-pencil" onClick={this.unlockEditor}></i>
                        <h3>
                            <input ref="textblockname" type="text" value={this.state.blockName ? this.state.blockName : ''} placeholder="Titre..." onChange={this.handleBlockName}/>
                            { this.state.changeName ? <button onClick={this.saveBlock.bind(this, true)}><i className="fa fa-check"></i></button> : null }
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

                    { this.state.editBlock ? null : <div className="block-save"><button className="text-block-save" onClick={this.saveBlock.bind(this, true)}><i className="fa fa-check"></i> Enregistrer</button></div> }
                </div>

                { this.state.glossaryModalState
                    ? <Modal active={this.handleGlossaryModalState} mystyle={""} title={"Créer une définition"}>
                        <TermOverlay select={this.state.selectedText} modalState={this.handleGlossaryModalState}/>
                    </Modal>
                    : null
                }

                { this.state.formulaModalState
                    ? <Modal active={this.handleFormulaModalState} mystyle={""} title={"Ajouter un formule"}>
                        <div>
                            <input type="text" value={this.state.formulaString} onChange={this.handleFormulaChange} />
                            <input type="submit" value="Ok" onClick={this.saveFormula} />
                        </div>
                    </Modal>
                    : null
                }

                { this.state.modalState
                    ? <Modal active={this.handleModalState} mystyle={""} title={"Exporter le bloc"}>
                            <div className="modal-in">
                                { this.state.loading
                                    ? <Loader />
                                    : <ContainersList
                                            closeModal={this.closeModal}
                                            containers={this.state.containersList}
                                            block={block.id}
                                            addBlock={this.handleBlockAdd}
                                        />
                                }
                            </div>
                        </Modal>
                    : null
                }

                { this.state.helpModalState
                    ? <Modal active={this.handleHelpModalState} mystyle={""} title={"Aide pour le bloc Texte"}>
                            <div>
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
                    <i className="fa fa-cog" onClick={this.viewBlockAction} ></i>
                    <i className="fa fa-question-circle" onClick={this.handleHelpModalState} ></i>
                    <button className="handle" title="Déplacer le bloc"></button>
                </div>

                <Tooltip tooltipState={this.handleTooltipState}>
                    { this.state.tooltipState
                        ? <div className="block-actions">
                            { this.state.editBlock
                                ? <button className="text-block-edit" onClick={this.unlockEditor}><i className="fa fa-pencil"></i> Editer</button>
                                : <button className="text-block-save" onClick={this.saveBlock.bind(this, true)}><i className="fa fa-check"></i> Enregistrer</button>
                            }
                            <br/>
                            <button className="btn-block" onClick={this.exportBlock.bind(this, block.id)}><i className="fa fa-files-o"></i> Dupliquer</button>
                            <br/>
                            <button className="btn-block" onClick={this.handleRemoveBlock}><i className="fa fa-remove"></i> Supprimer</button><br/>
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
