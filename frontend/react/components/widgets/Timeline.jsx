var React = require('react');
var ReactDOM = require('react-dom');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');


var Timeline = React.createClass({
	getInitialState: function() {
	  return {
	    blocks: [],
	    currentPos: null,
	    dragged: false,
	    currentBlock: null,
	    currentBlockId: null,
	    menuActive: false,
	    divHeight: 130,
	    topPx: 60,
	    scrollPos: 0
	  };
	},

	componentDidMount: function() {
	  this.setState({ 
	  	blocks: this.props.blocks,
	  });
	  if (this.props.blocks[0]) {
			this.setState({ 
	  		currentBlock: this.props.blocks[0],
	  		currentBlockId: 1
	  	});
		}

		var that = this;
		$(this.refs.timelinehandle).draggable({ 
			containment: "parent",
			axis: "y",
			drag: function(event, ui) { 
        var offsetElem = that.refs.timelinehandle.offsetTop;
        var body = document.body,
		    		html = document.documentElement,
						height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight ),
						offset = html.offsetHeight,
						maxScroll = Math.floor( height - offset ),
						currentPos = Math.floor( scroll / maxScroll * 100 ),
						toPos = Math.floor( maxScroll * offsetElem / 100 );

        that.setState({
        	dragged: true,
        	scrollPos: toPos,
        	currentPos: currentPos
        });

        window.scrollTo(0, that.state.scrollPos);
			}
		});

		this.setState({
			dragged: false
		});

	  window.addEventListener('scroll', this.handleScroll);
	},

	componentWillUnmount: function() {
    window.removeEventListener('scroll', this.handleScroll);
	},

	getFirst: function(blocks) {
		if (blocks.length > 0)
			return blocks[0];
		else
			return null;
	},

	getLast: function(blocks) {
		if (blocks.length > 0)
			return blocks[blocks.length-1];
		else
			return null;
	},

	handleScroll: function(event) {
    var scroll = window.pageYOffset,
        body = document.body,
    		html = document.documentElement,
				height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight ),
				offset = html.offsetHeight,
				maxScroll = Math.floor( height - offset ),
				currentPos = Math.floor( scroll / maxScroll * 100 ),
				toScrollPos = Math.floor( maxScroll * currentPos / 100 );

		for ( var i in this.props.blocks ) {
			if (currentPos > 99) {
				this.setState({ 
					currentBlock: this.props.blocks[this.props.blocks.length-1],
					currentBlockId: this.props.blocks.length
				});
			} else if ( scroll >= document.getElementById("block-" + this.props.blocks[i]["id"]).offsetTop ) {
				this.setState({ 
					currentBlock: this.props.blocks[i],
					currentBlockId: parseInt(i) + 1
				});
			} 
		}
		
		if (this.state.dragged === false)
    	this.setState({ currentPos: currentPos });
	},

	handleClick: function(blockId, event) {
		event.preventDefault();
		var block = document.getElementById("block-" + blockId).offsetTop;
		window.scrollTo(0, block);
	},

	toggleMenu: function() {
		this.setState({ menuActive: !this.state.menuActive });
	},

	render: function(){
		var blocks = this.props.blocks;
		var total = this.props.blocks.length;
		var firstBlock = this.getFirst(blocks);
		var lastBlock = this.getLast(blocks);

		const progress = {
			width: this.state.currentPos + "%"
		};

		const style = {
			height: this.state.divHeight + "px",
			top: this.state.topPx + "px"
		};

		const height = {
			height: this.state.divHeight + "px"
		};

		const scrollHandleTopPos = {
			top: this.state.currentPos + "px"
		};

		return(
			<div id="timeline">
				<div className="timeline-container">
					<div className="blocks-timeline">
						<div className="timeline-progress" onClick={this.toggleMenu}>
							<div className="timeline-progress-content" style={progress}>
								<div className="timeline-progress-content-inner">{ this.state.currentBlock ? this.state.currentBlockId + "/" + total : null }</div>
							</div>
						</div>
						<div className={this.state.menuActive ? "timeline-menu timeline-menu-active" : "timeline-menu"}>
							{ firstBlock
								? <a title={firstBlock.id} href="javascript:;" onClick={this.handleClick.bind(this, firstBlock.id)} className="widget-link start-link">Bloc 1</a>
								: null
							}
							{ lastBlock
								? <a title={lastBlock.id} href="javascript:;" onClick={this.handleClick.bind(this, lastBlock.id)} className="widget-link last-link">Bloc {blocks.length}</a>
								: null
							}
						</div>
					</div>
				</div>

				<div id="vertical-timeline" style={style}>
					<div className="v-timeline-scrollarea" style={height}>
						<div className="v-timeline-padding" rel="timelinescrollbefore"></div>
						<div id="v-timeline-handle" ref="timelinehandle" style={scrollHandleTopPos}></div>
						<div className="v-timeline-padding" rel="timelinescrollafter"></div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Timeline;