var React = require('react');
var Constants = require('../constants');
var ReactDOM = require('react-dom');
var Loader = require('../widgets/Loader.jsx');
var NotificationSystem = require('react-notification-system');
var Tooltip = require('../widgets/Tooltip.jsx');
var Modal = require('../widgets/Modal.jsx');
var ContainersList = require('./ContainersList.jsx');


var MathToolbox = React.createClass({
    getInitialState: function() {
        return {
            arrow: false,
            letter: false
        }
    },
    addMath: function(fn) {
        this.props.interact("\\" + fn);
    },
    activeSymbol: function (){
        this.setState({
            symbol: true,
            arrow: false,
            letter: false
        })
    },
    activeArrow: function (){
        this.setState({
            symbol: false,
            arrow: true,
            letter: false
        })
    },
    activeLetter: function (){
        this.setState({
            symbol: false,
            arrow: false,
            letter: true
        })
    },

    render: function() {
        return (
            <div id="mathToolbar">
                <button className="symbol" onClick={this.activeSymbol}>Symbols</button>
                <button className="arrows" onClick={this.activeArrow}>Arrows</button>
                <button className="letter" onClick={this.activeLetter}>Greek Letters</button>

                {this.state.symbol
                    ? <ul className="symbolList">
                        <li><button onClick={this.addMath.bind(this, " +")}>+</button></li>
                        <li><button onClick={this.addMath.bind(this, "times")}>x</button></li>
                        <li><button onClick={this.addMath.bind(this, " -")}>-</button></li>
                        <li><button onClick={this.addMath.bind(this, "div")}>division</button></li>
                        <li><button onClick={this.addMath.bind(this, "pm")}>plus ou moin</button></li>
                        <li><button onClick={this.addMath.bind(this, "ast")}>etoile</button></li>
                    </ul>
                    :null
                }
                
                {this.state.arrow
                    ? <ul className="arrowsList">
                        <li><button onClick={this.addMath.bind(this, ";")}>espace</button></li>
                        <li><button onClick={this.addMath.bind(this, "frac")}>frac</button></li>
                        <li><button onClick={this.addMath.bind(this, "sqrt{}")}>racine</button></li>
                        <li><button onClick={this.addMath.bind(this, "int_")}>∫</button></li>
                        <li><button onClick={this.addMath.bind(this, "infty")}>∞</button></li>
                    </ul>
                    :null
                }

                {this.state.letter
                    ? <ul className="letterList">
                        <li><button onClick={this.addMath.bind(this, "alpha")}>alpha</button></li>
                        <li><button onClick={this.addMath.bind(this, "delta")}>delta</button></li>
                        <li><button onClick={this.addMath.bind(this, "eta")}>eta</button></li>
                        <li><button onClick={this.addMath.bind(this, "kappa")}>kappa</button></li>
                        <li><button onClick={this.addMath.bind(this, "xi")}>xi</button></li>
                        <li><button onClick={this.addMath.bind(this, "phi")}>phi</button></li>
                        <li><button onClick={this.addMath.bind(this, "omega")}>omega</button></li>
                        <li><button onClick={this.addMath.bind(this, "Delta")}>Delta</button></li>
                        <li><button onClick={this.addMath.bind(this, "Gamma")}>Gamma</button></li>
                        <li><button onClick={this.addMath.bind(this, "Psi")}>Psi</button></li>
                        <li><button onClick={this.addMath.bind(this, "vartheta ")}>vartheta </button></li>
                        <li><button onClick={this.addMath.bind(this, "varsigma")}>varsigma</button></li>
                        <li><button onClick={this.addMath.bind(this, "beta")}>beta</button></li>
                        <li><button onClick={this.addMath.bind(this, "epsilon")}>epsilon</button></li>
                        <li><button onClick={this.addMath.bind(this, "theta")}>theta</button></li>
                        <li><button onClick={this.addMath.bind(this, "lambda")}>lambda</button></li>
                        <li><button onClick={this.addMath.bind(this, "pi")}>pi</button></li>
                        <li><button onClick={this.addMath.bind(this, "tau")}>tau</button></li>
                        <li><button onClick={this.addMath.bind(this, "chi")}>chi</button></li>
                        <li><button onClick={this.addMath.bind(this, "Omega")}>Omega</button></li>
                        <li><button onClick={this.addMath.bind(this, "Pi")}>Pi</button></li>
                        <li><button onClick={this.addMath.bind(this, "Lambda")}>Lambda</button></li>
                        <li><button onClick={this.addMath.bind(this, "Xi")}>Xi</button></li>
                        <li><button onClick={this.addMath.bind(this, "varrho")}>varrho</button></li>
                        <li><button onClick={this.addMath.bind(this, "gamma")}>gamma</button></li>
                        <li><button onClick={this.addMath.bind(this, "zeta")}>zeta</button></li>
                        <li><button onClick={this.addMath.bind(this, "iota")}>iota</button></li>
                        <li><button onClick={this.addMath.bind(this, "mu")}>mu</button></li>
                        <li><button onClick={this.addMath.bind(this, "rho")}>rho</button></li>
                        <li><button onClick={this.addMath.bind(this, "upsilon")}>upsilon</button></li>
                        <li><button onClick={this.addMath.bind(this, "psi")}>psi</button></li>
                        <li><button onClick={this.addMath.bind(this, "Theta")}>Theta</button></li>
                        <li><button onClick={this.addMath.bind(this, "Phi")}>Phi</button></li>
                        <li><button onClick={this.addMath.bind(this, "Sigma")}>Sigma</button></li>
                        <li><button onClick={this.addMath.bind(this, "Upsilon")}>Upsilon</button></li>
                        <li><button onClick={this.addMath.bind(this, "varphi")}>varphi</button></li>
                    </ul>
                    :null
                }
                
            </div>
            
        );
    }
});


var MathBlock = React.createClass({
	getInitialState: function() {
        return {
            changeName: false,
            blockName: '',
            areaContent: '',
            value: '',
            tooltipState: false,
            tooltipMovesState: false
        }
    },

    componentDidMount: function (root) {
        this.setState({
            blockName: this.props.block.name,
            areaContent: this.props.block.content,
            value: this.props.block.content
        });

        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.refs.output]);
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

    handleBlockAdd: function(data) {
        /* updates the block list after a duplication on the same page */
        this.props.addBlock(data);
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

    handleInteraction: function(fn) {
        this.setState({
            areaContent: this.refs.matharea.value + fn
        });

        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.refs.output]);
    },

    handleChange: function(event) {
        this.setState({
            areaContent: event.target.value,
            value: this.refs.matharea.value
        });

        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.refs.output]);
    },

    handleRemoveBlock: function() {
        this.props.removeBlock(this.props.block);
    },

    handleBlockName: function(event) {
        this.setState({
            blockName: event.target.value,
            changeName: true
        });
    },

    createMarkup: function(data) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.refs.output]);
        return {__html: "$$" + data + "$$"};
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

                <div className="content" key={block.id}>
                    <div className="block-title">
                        <i className="fa fa-superscript"></i>
                        <h3>
                            <input type="text" value={this.state.blockName ? this.state.blockName : ''} placeholder="Titre..." onChange={this.handleBlockName}/>
                            { this.state.changeName ? <button title="Enregister" onClick={this.saveBlock.bind(this, true)}><i className="fa fa-check"></i></button> : null }
                        </h3>
                    </div>

                    <div className="block-content">
                        <MathToolbox interact={this.handleInteraction} />

                        <textarea ref="matharea" type="text" value={this.state.areaContent} onChange={this.handleChange} rows="5" cols="50" />

                        <div
                           className="content"
                           id="output"
                           ref="output"
                           dangerouslySetInnerHTML={this.createMarkup(this.state.value)}
                        />
                    </div>
                </div>

                <div className="action">
                    <i className="fa fa-cog" title="Paramètre" onClick={this.viewBlockAction} ></i>
                    <button className="handle" title="Déplacer le bloc" onClick={this.viewBlockMoves}></button>
                </div>

                <Tooltip tooltipState={this.handleTooltipState}>
                    { this.state.tooltipState
                        ? <div className="block-actions">
                            <button className="text-block-save" onClick={this.saveBlock}><i className="fa fa-check"></i> Enregistrer</button>
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


module.exports = MathBlock;
