var React = require('react');
var ReactDOM = require('react-dom');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var dragula = require('react-dragula');
var BlockTypes = require('../blocktypes');
var enhanceWithClickOutside = require('react-click-outside');


var Blockline = React.createClass({
	getInitialState: function() {
	  return {
	    blocks: [],
	    menu: false
	  };
	},

	componentWillReceiveProps: function() {
	  this.setState({ 
	  	blocks: this.props.blocks,
	  });  
	},

	componentDidMount: function() {
	  this.setState({ 
	  	blocks: this.props.blocks,
	  });

	  var container = ReactDOM.findDOMNode(this.refs.dragableblocks);
    /* makes the blocks draggable by using "handle" class elements in block's jsx */
    var drake = dragula([container], {
        moves: function (el, container, handle) {
            return handle.className === 'handle';
        }
    });

    this.moveItems(drake);
	},

	componentWillUnmount: function() {
    window.removeEventListener('scroll', this.handleScroll);
	},

	moveItems: function(drake) {
    for (name in CKEDITOR.instances) {
      CKEDITOR.instances[name].destroy(true);
    }
    
    var that = this;

    drake.on('drag', function(element, source) {
        var index = [].indexOf.call(element.parentNode.children, element);
    });

    drake.on('drop', function(element, target, source, sibling) {
        var index = [].indexOf.call(element.parentNode.children, element);
        var updated_sequence = [];
        var blocks = that.props.blocks;

        $(source).children().each(function(i) {
            updated_sequence.push({ id: $(this).data('id'), sequence: i });
        });

        $.ajax({
            type: "PUT",
            url: '/blocks/sort',
            context: that,
            data: { sequence: updated_sequence },
            success: function(data) {
                var sortedBlocks = [];
                for (var i in updated_sequence) {
                    var o = updated_sequence[i];
                    var block = $.grep(blocks, function(e){
                        if (e.id == o.id) return e;
                    });
                    sortedBlocks.push(block[0]);
                }

                that.props.updateBlockSequence(sortedBlocks);
            }
        });
    });
  },

  handleClick: function(blockId, event) {
		event.preventDefault();
		var block = document.getElementById("block-" + blockId).offsetTop;
		window.scrollTo(0, Math.floor(block - 45));
	},

	handleClickOutside: function() {
    this.setState({ menu: false });
  },

	render: function(){
		var blocks = this.props.blocks;
		var that = this;

		return(
			<div id="blockline">
				<div className="blockline-container">
					<div className="blockline-blocks" ref="dragableblocks">
						{ this.props.blocks.map(function(block, index) {
							return(
								<div className={"blockline-block " + BlockTypes[block.type_id]} key={block.id} data-id={block.id}>
									<button className="handle" title="Déplacer le bloc" onClick={that.handleClick.bind(that, block.id)}>
										<i className="fa"></i>
									</button>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
});

module.exports = enhanceWithClickOutside(Blockline);