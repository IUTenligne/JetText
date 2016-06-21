var React = require('react');
var Modal = require('../widgets/Modal.jsx');


var Formula = React.createClass({
    getInitialState: function() {
        return {
            blockId: null,
            formulaString: '',
            formulaOverview: '',
            variables: [],
            showAutocomplete: false,
            start: '@',
            matcher: /@(\w[\w.-]{0,59})\b$/i,
        };
    },

    componentDidMount: function() {
        this.setState({ blockId: this.props.blockId });
    },

    composeFormula: function(event) {
        var str = event.target.value;

        this.setState({ 
            formulaString: str,
            formulaOverview: str
        });

        if (str.match(this.state.matcher)) {
            var searchedVar = str.match(this.state.matcher)[1];
            $.ajax({
                type: "GET",
                url: "/search_variables/",
                data: { searched: searchedVar },
                context: this,
                success: function(data) {
                    if (data.status === 0) {
                        this.setState({ 
                            showAutocomplete: true,
                            variables: data.formulas
                        })
                    }
                }
            });
        }
    },

    selectVariable: function(variable) {
        var formula = this.state.formulaString.replace(this.state.matcher, "@"+variable.name);
        var str = this.state.formulaOverview.replace(this.state.matcher, variable.value);

        this.setState({
            showAutocomplete: false,
            variables: [],
            formulaString: formula,
            formulaOverview: str
        });
    },

    render: function() {
        var that = this;

        return(
            <div className="add_new">
                <p>
                    <span className="input-group-addon">
                        <i className="fa fa-pencil fa-fw"></i>
                    </span>
                    <input type="text" value={this.state.formulaString} onChange={this.composeFormula} />
                </p>

                <div ref="formulaarea" dangerouslySetInnerHTML={{ __html: this.state.formulaOverview }} />

                { this.state.showAutocomplete && this.state.variables.length > 0
                    ? <div ref="autocomplete" id="mention-autocomplete">
                        <ul>
                            { this.state.variables.map(function(variable, index) {
                                return( <li key={variable.id} onClick={that.selectVariable.bind(that, variable)}>{variable.name}</li> );
                            })}
                        </ul>
                    </div>
                    : null 
                }

                <p>
                    <input type="submit" className="btn-success" onClick={this.saveFormula} />
                </p>
            </div>
        );
    }
});

module.exports = Formula;