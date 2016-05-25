var React = require('react');
var Loader = require('../widgets/Loader.jsx');
var NotificationSystem = require('react-notification-system');
var Glossaries = require('../glossaries/Glossaries.jsx');
var Term = require('../glossaries/Term.jsx');
var TermOverlay = require('../glossaries/TermOverlay.jsx');
var Modal = require('../widgets/Modal.jsx');
var Tooltip = require('../widgets/Tooltip.jsx');
var ContainersList = require('./ContainersList.jsx');


var NoteBlock = React.createClass({
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
            formulaString: '',
            getEditor: '',
            selectedText: '',
            focusPopup: false,
            containersGlossariesList: [],
            selectedStyle: '',
            editBlock: true,
            tooltipState: false,
            modalState: false,
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
            var regex = new RegExp(termsList[i]["name"], "gi");
            if ( content.match(regex) ) {
                content = content.replace(regex, '<a href="#" data="'+termsList[i]["description"]+'">'+termsList[i]["name"]+'</a>');
            }
        }
        return content;
    },

    componentWillUnmount: function() {
        var editor = CKEDITOR.instances["note_block_"+this.props.block.id];
        
        /* Saves the block's content if before leaving the page */
        var block = this.props.block;
        $.ajax({
            type: "PUT",
            url: '/blocks/'+block.id,
            context: this,
            data: { 
                id: block.id, 
                name: this.state.blockName,
                content: this.state.blockContent,
                classes: this.state.selectedStyle
            }
        });

        if (editor) { editor.destroy(true); }
    },

    saveBlock: function() {
        var block = this.props.block;
        
        $.ajax({
            type: "PUT",
            url: '/blocks/'+block.id,
            context: this,
            data: { 
                id: block.id,
                name: this.state.blockName,
                content: this.state.blockContent,
                classes: this.state.selectedStyle
            },
            success: function(data) {
                this.setState({
                    blockName: data.name,
                    blockContent: data.content,
                    classes: data.classes,
                    changeName: false,
                    editBlock: true
                });
            }
        });

        var editor = CKEDITOR.instances["note_block_"+this.props.block.id];
        if (editor) { editor.destroy(true); }
    },

    unlockEditor: function() {
        var that = this;

        var editor = CKEDITOR.replace("note_block_"+this.props.block.id, {
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
        return "note_block_" + id;
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

    handleBlockName: function(event) {
        this.setState({
            blockName: event.target.value,
            changeName: true
        });
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
        this.setState({ tooltipState: !this.state.tooltipState });
    },

    handleTooltipState: function(st) {
        this.setState({ tooltipState: st });
    },

    handleRemoveBlock: function() {
        this.props.removeMe(this.props.block);
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

        var that = this;

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
                            <input ref="noteblockname" type="text" value={this.state.blockName ? this.state.blockName : ''} placeholder="Titre..." onChange={this.handleBlockName}/>
                            { this.state.changeName ? <button onClick={this.saveBlock}><i className="fa fa-check"></i></button> : null }
                        </h3>
                    </div>

                    <center className="block-note-types">
                        { this.state.noteStyles.map(function(style, i) {
                            return(
                                <div key={i} className={"note-style " + style} onClick={that.applyStyle.bind(that, style)}>
                                    <i className={"fa note-icon-" + style + " fa-fw"}></i>
                                </div>
                            );
                        })}
                    </center>

                    <div className={"block-note block-content block-content-" + this.state.selectedStyle} >
                        <div className={"block-note-title block-note-title-" + this.state.selectedStyle}>
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

                { this.state.glossaryModalState
                    ? <Modal active={this.handleGlossaryModalState} mystyle={""} title={"Créer une définition"}>
                        <TermOverlay select={this.state.selectedText} modalState={this.handleGlossaryModalState}/>
                    </Modal>
                    : null
                }

                { this.state.formulaModalState
                    ? <Modal active={this.handleFormulaModalState} mystyle={""} title={"Ajouter une formule"}>
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
                                    : <ContainersList closeModal={this.closeModal} containers={this.state.containersList} block={block.id} />
                                }
                            </div>
                        </Modal>
                    : null
                }

                <div className="action">
                    <i className="fa fa-cog" onClick={this.viewBlockAction} ></i>
                    <button className="handle"></button>
                </div>

                <Tooltip tooltipState={this.handleTooltipState}>
                    { this.state.tooltipState
                        ? <div className="block-actions">
                            { this.state.editBlock
                                ? <button className="text-block-edit" onClick={this.unlockEditor}><i className="fa fa-pencil"></i> Editer</button>
                                : <button className="text-block-save" onClick={this.saveBlock}><i className="fa fa-check"></i> Enregistrer</button>
                            }
                            <br/>
                            <button className="btn-block" onClick={this.exportBlock.bind(this, block.id)}><i className="fa fa-share-square-o"></i> Exporter</button>
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

module.exports = NoteBlock;
