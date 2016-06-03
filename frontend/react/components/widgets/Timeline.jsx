var React = require('react');
var ReactDOM = require('react-dom');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');


var Timeline = React.createClass({
	getInitialState: function() {
	  return {
	    blocks: [],
	    currentPos: null
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

    this.setState({ currentPos: currentPos });
	},

	handleClick: function(blockId, event) {
		event.preventDefault();
		var block = document.getElementById("block-"+blockId).offsetTop;
		window.scrollTo(0, block);
	},

	render: function(){
		var blocks = this.props.blocks;
		var total = this.props.blocks.length;
		var firstBlock = this.getFirst(blocks);
		var lastBlock = this.getLast(blocks);

		return(
			<div className="timeline">
				<div class="timeline-container">
					<div class="topic-timeline">
						{firstBlock
							? <a title={firstBlock.id} href="javascript:;" onClick={this.handleClick.bind(this, firstBlock.id)} class="widget-link start-link">Bloc {firstBlock.id}</a>
							: null
						}
						<div class="timeline-scrollarea">
							<div class="timeline-padding"></div>
							<div class="timeline-scroller">
								<div class="timeline-handle"></div>
								<div class="timeline-scroller-content">
									<div class="timeline-replies">1 / {total}</div>
									<div class="timeline-ago">{this.state.currentPos ? this.state.currentPos : null}</div>
								</div>
							</div>
							<div class="timeline-padding"></div>
						</div>
						{ lastBlock
							? <a title={lastBlock.id} href="javascript:;" onClick={this.handleClick.bind(this, lastBlock.id)} class="widget-link last-link">Bloc {lastBlock.id}</a>
							: null
						}
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Timeline;