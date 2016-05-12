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
            blockContent: '',
            editButton: true,
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
        this.serverRequest = $.get("/containers_glossaries/" + this.props.containerId +  ".json", function(result){
            this.setState({
                containersGlossariesList: result.containers_glossaries
            });
            
            if (result.containers_glossaries.length > 0){
                var that = this;

                for( var i in result.containers_glossaries ){
                    that.serverRequest = $.get("/glossaries/" + result.containers_glossaries[i]["glossary_id"] +  ".json", function(result){
                        that.setState({
                            termsList: result.terms,
                            blockContent: this.regexTerm(result.terms, this.props.block.content)
                        });
                    }.bind(that));
                }
            } else {
                this.setState({
                    blockContent: this.props.block.content
                });
            }
        }.bind(this));
        
        this._notificationSystem = this.refs.notificationSystem;

        /* Opens CKEditor if the block has no content */
        if (this.props.block.content == '') {
            this.unlockEditor();
        }
    },

    regexTerm: function(termsList, content){
        for ( var i in termsList) {
            var regex = new RegExp(termsList[i]["name"], "gi");
            if ( content.match(regex) ) {
                content = content.replace(regex, '<a href="#" style="background: red">'+termsList[i]["name"]+'</a>');
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
            data: { id: block.id, content: this.state.blockContent },
            success: function(data) {
                this.setState({
                    blockContent: data.content,
                    editButton: true
                })
            }
        });

        var editor = CKEDITOR.instances["text_block_"+this.props.block.id];
        if (editor) { editor.destroy(true); }

        this._notificationSystem.addNotification({
            title: 'Block saved !',
            level: 'success'
        });
    },

    unlockEditor: function() {
        var that = this;
        this.setState({ editButton: false });

        var editor = CKEDITOR.replace("text_block_"+this.props.block.id, {
            customConfig: '/assets/cke/custom_config.js'
        });

        editor.on('change', function( evt ) {
            var content = that._highlightText(evt.editor.getData(), editor);
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
        console.log(1, "bc: ", newData);

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
        
        if ( (txt.length > 0) && (!txt.match(/^\s$/))) {
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
                        <i className="fa fa-pencil"></i>
                        <h3>{block.name}</h3>
                        <span className="handle">+</span>
                    </div>

                    { this.state.loading
                        ? <Loader />
                        : <div id={this.dynamicId(block.id)} className="block-content" ref="editableblock" dangerouslySetInnerHTML={this.createMarkup(this.state.blockContent)} onDoubleClick={this.unlockEditor} />
                    }
                </div>

                { this.state.editButton 
                    ? <button className="btn-block block-actions" onClick={this.unlockEditor}><i className="fa fa-pencil"></i></button>
                    : <button className="btn-block block-actions" onClick={this.saveBlock}><i className="fa fa-check"></i></button>
                }

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
