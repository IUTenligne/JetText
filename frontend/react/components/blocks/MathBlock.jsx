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
            general: true,
            symbols: false,
            arrows: false,
            letters: false,
            matrice: false
        }
    },

    addMath: function(fn) {
        this.props.interact("\\" + fn);
    },

    activateToolbar: function (general, symbols, matrice, arrows, letters){
        this.setState({
            general: general,
            symbols: symbols,
            matrice: matrice,
            arrows: arrows,
            letters: letters
        })
    },

    render: function() {
        return (
            <div id="mathToolbar">
                <div id="btn">
                    <button onClick={this.activateToolbar.bind(this, true, false, false, false, false)} className={this.state.general ? "toolbar-active" : null} >Général</button>
                    <button onClick={this.activateToolbar.bind(this, false, true, false, false, false)} className={this.state.symbols ? "toolbar-active" : null}>Symboles</button>
                    <button onClick={this.activateToolbar.bind(this, false, false, true, false, false)} className={this.state.matrice ? "toolbar-active" : null}>Matrice</button>
                    <button onClick={this.activateToolbar.bind(this, false, false, false, true, false)} className={this.state.arrows ? "toolbar-active" : null}>Flèches</button>
                    <button onClick={this.activateToolbar.bind(this, false, false, false, false, true)} className={this.state.letters ? "toolbar-active" : null}>Lettres</button>
                </div>

                {this.state.general
                    ? <ul>
                        <li><button onClick={this.addMath.bind(this, ";")} className="blankspace" title="espace"><span>esp.</span></button></li>
                        <li><button onClick={this.addMath.bind(this, "textrm{abc}")} title="texte"><img src="/assets/mathjax/texte.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, " +")} title="plus">+</button></li>
                        <li><button onClick={this.addMath.bind(this, "times")} title="multiplication"><img src="/assets/mathjax/multiplication.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, " -")} title="moins">-</button></li>
                        <li><button onClick={this.addMath.bind(this, "div")} title="division"><img src="/assets/mathjax/division.svg"/></button></li>
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

                {this.state.symbols
                    ? <ul>
                        <li><button onClick={this.addMath.bind(this, "ast")}>&lowast;</button></li>
                        <li><button onClick={this.addMath.bind(this, "circ")}>°</button></li>
                        <li><button onClick={this.addMath.bind(this, "geq")}><img src="/assets/mathjax/plusgrand.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "leq")}><img src="/assets/mathjax/pluspetit.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "propto")}>&prop;</button></li>
                        <li><button onClick={this.addMath.bind(this, "underbrace{?}")}><img src="/assets/mathjax/arraybottom.svg"/></button></li>
                    </ul>
                    :null
                }

                {this.state.matrice
                    ? <ul>
                        <li><button onClick={this.addMath.bind(this, "left\\{\\begin{array}{l}?\\\\?\\end{array}\\right.")}><img src="/assets/mathjax/array2left.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "left\\{\\begin{array}{l}?&?\\\\?&?\\end{array}\\right.")}><img src="/assets/mathjax/array4left.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "left.\\begin{array}{r}?&?\\\\?\\end{array}\\right\\}")}><img src="/assets/mathjax/array2right.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "left.\\begin{array}{r}?&?\\\\?&?\\end{array}\\right\\}")}><img src="/assets/mathjax/array4right.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "underbrace{?}_\\textrm{abc}")}><img src="/assets/mathjax/arraybottomtexte.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "begin{bmatrix}?&?\\end{bmatrix}")}><img src="/assets/mathjax/croche2ligne.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "begin{bmatrix}?\\\\?\\end{bmatrix}")}><img src="/assets/mathjax/croche2colone.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "begin{bmatrix}?&?\\\\?&?\\end{bmatrix}")}><img src="/assets/mathjax/croche4colone.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "begin{pmatrix}?&?\\end{pmatrix}")}><img src="/assets/mathjax/parenthese2ligne.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "begin{pmatrix}?\\\\?\\end{pmatrix}")}><img src="/assets/mathjax/parenthese2colone.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "begin{pmatrix}?&?\\\\?&?\\end{pmatrix}")}><img src="/assets/mathjax/parenthese4colone.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "begin{array}{c}?\\\\?\\\\?\\end{array}")}><img src="/assets/mathjax/3colone.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "begin{array}{cc}?&?\\\\?&?\\\\?&?\\end{array}")}><img src="/assets/mathjax/2X3colone.svg"/></button></li>
                        <li><button onClick={this.addMath.bind(this, "begin{array}{rcl}?&=&?\\\\?&=&?\\end{array}")}><img src="/assets/mathjax/2egale.svg"/></button></li>
                    </ul>
                    :null
                }
                
                {this.state.arrows
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

                {this.state.letters
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
            blockName: '',
            areaContent: '',
            editButton: false,
            toolboxState: true,
            value: '',
            tooltipState: false,
            tooltipMovesState: false,
            editBlock: false,
            helpModalState: false
        }
    },

    componentDidMount: function() {
        if (this.props.block.content != '') {
            this.setState({
                blockName: this.props.block.name,
                areaContent: this.props.block.content,
                value: this.props.block.content,
                editBlock: true,
                toolboxState: false
            });
        } else {
            this.setState({
                blockName: this.props.block.name,
                areaContent: this.props.block.content,
                value: this.props.block.content,
                editBlock: false,
                toolboxState: true
            });
        }

        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.refs.output]);
    },

    saveBlock: function(id, name, content) {
        var block = { id: id, name: name, content: content };
        this.props.saveBlock(block);
        this.setState({ 
            editBlock: true,
            toolboxState: false
        });
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
            areaContent: this.refs.matharea.value + fn,
            value: this.refs.matharea.value + fn
        });

        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.refs.output]);
    },

    handleChange: function(event) {
        this.setState({
            areaContent: event.target.value,
            value: this.refs.matharea.value
        });

        this.saveDraft(this.props.block.id, this.state.blockName, event.target.value);

        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.refs.output]);
    },

    handleRemoveBlock: function() {
        this.props.removeBlock(this.props.block);
    },

    handleBlockName: function(event) {
        this.setState({
            blockName: event.target.value
        });

        this.saveDraft(this.props.block.id, event.target.value, this.state.areaContent);
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

    showEditButton: function() {
        this.setState({ editButton: true });
    },

    hideEditButton: function() {
        this.setState({ editButton: false });
    },

    toggleToolbox: function() {
        this.setState({ toolboxState: !this.state.toolboxState });
        if(this.state.editBlock == true){
            this.setState({ editBlock: false});
        }
    },
    handleHelpModalState: function() {
        this.setState({ helpModalState: !this.state.helpModalState });
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
                        </h3>
                    </div>

                    
                    
                    <div className="block-content">

                        <div
                           className="content"
                           id="output"
                           ref="output"
                           dangerouslySetInnerHTML={this.createMarkup(this.state.value)}
                        />

                        { this.state.toolboxState 
                            ?
                            <div>
                                <textarea 
                                    ref="matharea" 
                                    type="text" 
                                    value={this.state.areaContent} 
                                    onChange={this.handleChange} 
                                    rows="5" 
                                    cols="50" 
                                    id="block-math"
                                    placeholder="Formule LaTeX..."
                                />
                                
                                <MathToolbox interact={this.handleInteraction} /> 
                            </div>

                         : null }
                    </div>
                </div>               

                <div className="action">
                    { this.state.editBlock
                        ? <i onClick={this.toggleToolbox} title="Editer" className="fa fa-pencil"></i>
                        :<i 
                            className="fa fa-check"
                            onClick={this.saveBlock.bind(this, this.props.block.id, this.state.blockName, this.state.areaContent)}
                            title="Enregistrer"
                            >
                        </i>
                    }
                    <i className="fa fa-cog" title="Paramètre" onClick={this.viewBlockAction} ></i>
                    <i className="fa fa-question-circle" title="Aide" onClick={this.handleHelpModalState} ></i>
                    <button className="handle" title="Déplacer le bloc" onClick={this.viewBlockMoves}></button>
                </div>

                <Tooltip tooltipState={this.handleTooltipState}>
                    { this.state.tooltipState
                        ? <div className="block-actions">
                            <button className="btn-block" onClick={this.exportBlock}><i className="fa fa-files-o"></i> Dupliquer</button>
                            <br/>
                            <button className="btn-block" onClick={this.handleRemoveBlock}><i className="fa fa-remove"></i> Supprimer</button><br/>
                        </div>
                        : null
                    }
                </Tooltip>

                { this.state.helpModalState
                    ? <Modal active={this.handleHelpModalState} mystyle={"help"} title={"Aide"}>
                            <div className="modal-in math">
                                <h4> Block Math (En cours d'édition)</h4>
                                

                                Editer le block :
                                <ul>
                                    <li>cliquez sur l'icône <i className="fa fa-pencil"></i>.</li>
                                </ul>
                                <br/>
                                Enregistrer le block :
                                <ul>
                                    <li>cliquez sur l'icône <i className="fa fa-check"></i>.</li>
                                </ul>
                            </div>
                        </Modal>
                    : null
                }

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
