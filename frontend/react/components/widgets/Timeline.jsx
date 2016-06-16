var React = require('react');
var Constants = require('../constants');
var ReactDOM = require('react-dom');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var enhanceWithClickOutside = require('react-click-outside');


var Timeline = React.createClass({
	getInitialState: function() {
	  return {
	    blocks: [],
	    currentPos: null,
	    currentBlock: null,
	    currentBlockId: null,
	    menu: false
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
				currentPos = Math.floor( scroll / maxScroll * 100 );

		for ( var i in this.props.blocks ) {
			if (currentPos > 99) {
				this.setState({ 
					currentBlock: this.props.blocks[this.props.blocks.length-1],
					currentBlockId: this.props.blocks.length
				});
			} else if ( Math.floor(scroll + parseInt(Constants.blockOffsetScroll)) >= document.getElementById("block-" + this.props.blocks[i]["id"]).offsetTop ) {
				this.setState({ 
					currentBlock: this.props.blocks[i],
					currentBlockId: parseInt(i) + 1
				});
			} 
		}

    this.setState({ currentPos: currentPos });
	},

	handleClick: function(blockId, event) {
		event.preventDefault();
		var block = document.getElementById("block-" + blockId).offsetTop;
		this.setState({ menu: false });
		window.scrollTo(0, Math.floor(block - parseInt(Constants.blockOffsetScroll)));
	},

	toggleMenu: function() {
		this.setState({ menu: !this.state.menu});
	},

	handleClickOutside: function() {
    this.setState({ menu: false });
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
      display: "none"
    };

		return(
			<div id="timeline" onClick={this.toggleMenu}>
				<div className="timeline-container">
					<div className="blocks-timeline">
						<div className="timeline-progress" onClick={this.toggleMenu}>
							<div className="timeline-progress-content" style={progress}>
								<div className="timeline-progress-content-inner">{ this.state.currentBlock ? this.state.currentBlockId + "/" + total : null }</div>
							</div>
						</div>
					</div>
				</div>

				<div id="timeline-menu" style={this.state.menu ? null : style}>
          <ul>
            <li>
              { firstBlock
								? <a title={firstBlock.id} href="javascript:;" onClick={this.handleClick.bind(this, firstBlock.id)}><i className="fa fa-chevron-up"></i> 1</a>
								: null
							}
            </li>
            <li>
							{ lastBlock
								? <a title={lastBlock.id} href="javascript:;" onClick={this.handleClick.bind(this, lastBlock.id)}><i className="fa fa-chevron-down"></i> {blocks.length}</a>
								: null
							}
            </li>
          </ul>
        </div>
			</div>
		);
	}
});

module.exports = enhanceWithClickOutside(Timeline);