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
            symbol: false,
            arrow: false,
            letter: false,
            general: true
        }
    },
    addMath: function(fn) {
        this.props.interact("\\" + fn);
    },
    activeGeneral: function (){
        this.setState({
            symbol: false,
            arrow: false,
            letter: false,
            general: true
        })
    },
    activeSymbol: function (){
        this.setState({
            symbol: true,
            arrow: false,
            letter: false,
            general: false
        })
    },
    activeArrow: function (){
        this.setState({
            symbol: false,
            arrow: true,
            letter: false,
            general: false
        })
    },
    activeLetter: function (){
        this.setState({
            symbol: false,
            arrow: false,
            letter: true,
            general: false
        })
    },

    render: function() {
        return (
            <div id="mathToolbar">
                <div id="btn">
                    <button onClick={this.activeGeneral}>General</button>
                    <button onClick={this.activeSymbol}>Symbols</button>
                    <button onClick={this.activeArrow}>Arrows</button>
                    <button onClick={this.activeLetter}>Letters</button>
                    <button onClick={this.addMath.bind(this, ";")}>espace</button>
                </div>
                {this.state.general
                    ? <ul>
                        <li><button onClick={this.addMath.bind(this, "textrm{abc}")}><img src="/assets/mathjax/texte.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, " +")}>+</button></li>
                        <li><button onClick={this.addMath.bind(this, "times")}><img src="/assets/mathjax/multiplication.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, " -")}>-</button></li>
                        <li><button onClick={this.addMath.bind(this, "div")}><img src="/assets/mathjax/division.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "pm")}><img src="/assets/mathjax/plusmoin.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "mp")}><img src="/assets/mathjax/moinplus.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, " =")}>=</button></li>
                        <li><button onClick={this.addMath.bind(this, "neq")}><img src="/assets/mathjax/pasegale.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "frac{?}{?}")}><img src="/assets/mathjax/frac.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "sqrt{?}")}>&radic;</button></li>
                        <li><button onClick={this.addMath.bind(this, "int_{?}^{?}")}><img src="/assets/mathjax/integral.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "int_{?} ")}><img src="/assets/mathjax/integral1.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "infty")}>&infin;</button></li>
                    </ul>
                    :null
                }

                {this.state.symbol
                    ? <ul>
                        <li><button onClick={this.addMath.bind(this, "ast")}>&lowast;</button></li>
                        <li><button onClick={this.addMath.bind(this, "circ")}>°</button></li>
                        <li><button onClick={this.addMath.bind(this, "geq")}><img src="/assets/mathjax/plusgrand.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "leq")}><img src="/assets/mathjax/pluspetit.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "propto")}>&prop;</button></li>
                        <li><button onClick={this.addMath.bind(this, "left\\{\\begin{array}{l}?\\\\?\\end{array}\\right.")}><img src="/assets/mathjax/array2left.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "left\\{\\begin{array}{l}?&?\\\\?&?\\end{array}\\right.")}><img src="/assets/mathjax/array4left.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "left.\\begin{array}{r}?&?\\\\?\\end{array}\\right\\}")}><img src="/assets/mathjax/array2right.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "left.\\begin{array}{r}?&?\\\\?&?\\end{array}\\right\\}")}><img src="/assets/mathjax/array4right.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "begin{bmatrix}?&?\\end{bmatrix}")}><img src="/assets/mathjax/croche2colone.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "begin{bmatrix}?\\\\?\\end{bmatrix}")}><img src="/assets/mathjax/croche2colone.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "begin{bmatrix}?&?\\\\?&?\\end{bmatrix}")}><img src="/assets/mathjax/croche4colone.svg"/></button></li>
                    </ul>
                    :null
                }
                
                {this.state.arrow
                    ? <ul>
                        <li><button onClick={this.addMath.bind(this, "leftarrow ")}>&larr;</button></li>
                        <li><button onClick={this.addMath.bind(this, "rightarrow ")}>&rarr;</button></li>
                        <li><button onClick={this.addMath.bind(this, "uparrow")}>&uarr;</button></li>
                        <li><button onClick={this.addMath.bind(this, "downarrow")}>&darr;</button></li>

                        <li><button onClick={this.addMath.bind(this, "Leftarrow")}>&lArr;</button></li>
                        <li><button onClick={this.addMath.bind(this, "Rightarrow ")}>&rArr;</button></li>
                        <li><button onClick={this.addMath.bind(this, "Downarrow")}>&dArr;</button></li>
                        <li><button onClick={this.addMath.bind(this, "Uparrow")}>&uArr;</button></li>

                        <li><button onClick={this.addMath.bind(this, "leftrightarrow")}>&harr;</button></li>
                        <li><button onClick={this.addMath.bind(this, "Leftrightarrow")}>&hArr;</button></li>                    
                        </ul>
                    :null
                }

                {this.state.letter
                    ? <ul>
                        <li><button onClick={this.addMath.bind(this, "alpha")}>&alpha;</button></li>
                        <li><button onClick={this.addMath.bind(this, "delta")}>&delta;</button></li>
                        <li><button onClick={this.addMath.bind(this, "eta")}>&eta;</button></li>
                        <li><button onClick={this.addMath.bind(this, "kappa")}>&kappa;</button></li>
                        <li><button onClick={this.addMath.bind(this, "xi")}>&xi;</button></li>
                        <li><button onClick={this.addMath.bind(this, "omega")}>&omega;</button></li>
                        <li><button onClick={this.addMath.bind(this, "Delta")}>&Delta;</button></li>
                        <li><button onClick={this.addMath.bind(this, "Gamma")}>&Gamma;</button></li>
                        <li><button onClick={this.addMath.bind(this, "Psi")}>&psi;</button></li>
                        <li><button onClick={this.addMath.bind(this, "vartheta ")}>&thetasym; </button></li>
                        <li><button onClick={this.addMath.bind(this, "varsigma")}>&sigmaf;</button></li>
                        <li><button onClick={this.addMath.bind(this, "beta")}>&beta;</button></li>
                        <li><button onClick={this.addMath.bind(this, "epsilon")}>&epsilon;</button></li>
                        <li><button onClick={this.addMath.bind(this, "theta")}>&Theta;</button></li>
                        <li><button onClick={this.addMath.bind(this, "lambda")}>&lambda;</button></li>
                        <li><button onClick={this.addMath.bind(this, "pi")}>&pi;</button></li>
                        <li><button onClick={this.addMath.bind(this, "tau")}>&tau;</button></li>
                        <li><button onClick={this.addMath.bind(this, "chi")}>&chi;</button></li>
                        <li><button onClick={this.addMath.bind(this, "Omega")}>&Omega;</button></li>
                        <li><button onClick={this.addMath.bind(this, "Pi")}>&Pi;</button></li>
                        <li><button onClick={this.addMath.bind(this, "Lambda")}>&Lambda;</button></li>
                        <li><button onClick={this.addMath.bind(this, "Xi")}>&Xi;</button></li>
                        <li><button onClick={this.addMath.bind(this, "gamma")}>&gamma;</button></li>
                        <li><button onClick={this.addMath.bind(this, "zeta")}>&zeta;</button></li>
                        <li><button onClick={this.addMath.bind(this, "iota")}>&iota;</button></li>
                        <li><button onClick={this.addMath.bind(this, "mu")}>&mu;</button></li>
                        <li><button onClick={this.addMath.bind(this, "rho")}>&rho;</button></li>
                        <li><button onClick={this.addMath.bind(this, "upsilon")}>&upsilon;</button></li>
                        <li><button onClick={this.addMath.bind(this, "psi")}>&psi;</button></li>
                        <li><button onClick={this.addMath.bind(this, "Theta")}>&theta;</button></li>
                        <li><button onClick={this.addMath.bind(this, "phi")}>&phi;</button></li>
                        <li><button onClick={this.addMath.bind(this, "Sigma")}>&Sigma;</button></li>
                        <li><button onClick={this.addMath.bind(this, "Upsilon")}>&Upsilon;</button></li>
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
                <div className="block-inner-content" key={block.id}>
                    <div className="block-title">
                        <i className="fa fa-superscript"></i>
                        <h3>
                            <input type="text" value={this.state.blockName ? this.state.blockName : ''} placeholder="Titre..." onChange={this.handleBlockName}/>
                            { this.state.changeName 
                                ? <button 
                                    title="Enregister" 
                                    onClick={this.saveBlock.bind(this, this.props.block.id, this.state.blockName, this.state.areaContent)}>
                                    <i className="fa fa-check"></i></button> 
                                : null 
                            }
                        </h3>
                    </div>

                    <div className="block-content">

                        <div
                           className="content"
                           id="output"
                           ref="output"
                           dangerouslySetInnerHTML={this.createMarkup(this.state.value)}
                        />
                        <textarea 
                            ref="matharea" 
                            type="text" 
                            value={this.state.areaContent} 
                            onChange={this.handleChange} 
                            rows="5" 
                            cols="50" 
                            id="block-math"
                        />
                            
                        <MathToolbox interact={this.handleInteraction} />

                    </div>
                </div>

                <div className="action">
                    <i className="fa fa-cog" title="Paramètre" onClick={this.viewBlockAction} ></i>
                    <button className="handle" title="Déplacer le bloc" onClick={this.viewBlockMoves}></button>
                </div>

                <Tooltip tooltipState={this.handleTooltipState}>
                    { this.state.tooltipState
                        ? <div className="block-actions">
                            <button 
                                className="text-block-save" 
                                onClick={this.saveBlock.bind(this, this.props.block.id, this.state.blockName, this.state.areaContent)}>
                                <i className="fa fa-check"></i> Enregistrer
                            </button>
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
