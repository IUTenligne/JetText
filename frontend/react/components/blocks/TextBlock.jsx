var React = require('react');
var Loader = require('../widgets/Loader.jsx');
var NotificationSystem = require('react-notification-system');
var Glossaries = require('../glossaries/Glossaries.jsx');
var Term = require('../glossaries/term.jsx');
var TermOverlay = require('../glossaries/termOverlay.jsx');
var Modal = require('../widgets/Modal.jsx');


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
            formulaString: '',
            getEditor: '',
            selectedText: '',
            focusPopup: false,
            containersGlossariesList: []
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
            this.handleUnlockEditor();
        }
    },

    componentWillReceiveProps: function(newProps) {
        if (newProps.editBlock == false) {
            this.unlockEditor();
        } else if (newProps.editBlock == true) {
            this.saveBlock();
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
            data: { id: block.id, content: this.state.blockContent }
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
                content: this.state.blockContent
            },
            success: function(data) {
                this.setState({
                    blockName: data.name,
                    blockContent: data.content,
                    changeName: false
                });
            }
        });

        var editor = CKEDITOR.instances["text_block_"+this.props.block.id];
        if (editor) { editor.destroy(true); }
    },

    unlockEditor: function() {
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

        this.setState({ focusPopup: false });
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

    handleUnlockEditor: function() {
        this.props.editBlockAction(false);
    },

    handleBlockName: function(event) {
        this.setState({
            blockName: event.target.value,
            changeName: true
        });
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
                                <i className="fa fa-book fa-fw" title="Glossary" aria-hidden="true"></i>
                            </a>
                        </div>
                        : null
                    }
                    
                    <div className="block-title">
                        <i className="fa fa-pencil" onClick={this.handleUnlockEditor}></i>
                        <h3>
                            <input type="text" value={this.state.blockName ? this.state.blockName : ''} placeholder="Block name..." onChange={this.handleBlockName}/>
                            { this.state.changeName ? <button onClick={this.saveBlock}><i className="fa fa-check"></i></button> : null }
                        </h3>
                    </div>

                    { this.state.blockVirtualContent != ''
                        ? <div id={this.dynamicId(block.id)} className="block-content" ref="editableblock" dangerouslySetInnerHTML={this.createMarkup(this.state.blockVirtualContent)} onDoubleClick={this.handleUnlockEditor}/>
                        : <div id={this.dynamicId(block.id)} className="block-content" ref="editableblock" dangerouslySetInnerHTML={this.createMarkup(this.state.blockContent)} onDoubleClick={this.handleUnlockEditor}/>
                    }
                </div>

                { this.state.glossaryModalState
                    ? <Modal active={this.handleGlossaryModalState} title={"Create new definition"}>
                        <TermOverlay select={this.state.selectedText} modalState={this.handleGlossaryModalState}/>
                    </Modal>
                    : null
                }

                { this.state.formulaModalState
                    ? <Modal active={this.handleFormulaModalState} title={"Add a formula"}>
                        <div>
                            <input type="text" value={this.state.formulaString} onChange={this.handleFormulaChange} />
                            <input type="submit" value="Ok" onClick={this.saveFormula} />
                        </div>
                    </Modal>
                    : null 
                }

                <NotificationSystem ref="notificationSystem"/>
            </div>
        );
	}
});

module.exports = TextBlock;
