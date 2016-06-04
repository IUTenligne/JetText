var React = require('react');
var ReactDOM = require('react-dom');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');


var Timeline = React.createClass({
	getInitialState: function() {
	  return {
	    blocks: [],
	    currentPos: null,
	    currentBlock: null,
	    currentBlockId: null
	  };
	},

	componentDidMount: function() {
	  this.setState({ blocks: this.props.blocks });
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
				height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight),
				offset = html.offsetHeight,
				maxScroll = Math.floor(height - offset),
				currentPos = Math.floor( scroll / maxScroll * 100 );

		var currentBlock = null;

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
		console.log(currentPos);
    this.setState({ currentPos: currentPos });
	},

	handleClick: function(blockId, event) {
		event.preventDefault();
		var block = document.getElementById("block-" + blockId).offsetTop;
		window.scrollTo(0, block);
	},

	render: function(){
		var blocks = this.props.blocks;
		var total = this.props.blocks.length;
		var firstBlock = this.getFirst(blocks);
		var lastBlock = this.getLast(blocks);

		var progress = {
			width: this.state.currentPos + "%"
		};

		return(
			<div id="timeline">
				<div className="timeline-container">
					<div className="topic-timeline">
						{ firstBlock
							? <a title={firstBlock.id} href="javascript:;" onClick={this.handleClick.bind(this, firstBlock.id)} className="widget-link start-link">Bloc 1</a>
							: null
						}
						<div className="timeline-scrollarea">
							<div className="timeline-padding"></div>
							<div className="timeline-scroller">
								<div className="timeline-handle"></div>
								<div className="timeline-progress">
									<div className="timeline-progress-content" style={progress}>
										<div className="timeline-progress-content-inner">{ this.state.currentBlock ? this.state.currentBlockId + "/" + total : null }</div>
									</div>
								</div>
								<div className="timeline-current">{ this.state.currentBlock ? this.state.currentBlockId : null }</div>
							</div>
							<div className="timeline-padding"></div>
						</div>
						{ lastBlock
							? <a title={lastBlock.id} href="javascript:;" onClick={this.handleClick.bind(this, lastBlock.id)} className="widget-link last-link">Bloc {blocks.length}</a>
							: null
						}
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Timeline;