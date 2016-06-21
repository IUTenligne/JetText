var React = require('react');
var Modal = require('../widgets/Modal.jsx');


var Formula = React.createClass({
    getInitialState: function() {
        return {
            blockId: null,
            formulaString: '',
            variables: [],
            overview: '',
            start: '@',
            matcher: /@(\w[\w.-]{0,59})\b/i,
        };
    },

    componentDidMount: function() {
        this.setState({ blockId: this.props.blockId });
    },

    composeFormula: function(event) {
        var str = event.target.value;
        if (str.match(this.state.matcher))
            event.target.value = str.replace(this.state.matcher, '<a href="javascript:;">'+str.match(this.state.matcher)[1]+'</a>');
        
        this.setState({
            formulaString: event.target.value
        });
    },



    render: function() {
        return(
            <div className="add_new">
                <p>
                    <span className="input-group-addon">
                        <i className="fa fa-pencil fa-fw"></i>
                    </span>
                    <input type="text" value={this.state.formulaString} onChange={this.composeFormula} />
                </p>
                <div ref="formulaarea" placeholder="Aperçu">{this.state.formulaAreaContent}</div>
                <p>
                    <input type="submit" className="btn-success" onClick={this.saveFormula} />
                </p>
            </div>
        );
    }
});

module.exports = Formula;