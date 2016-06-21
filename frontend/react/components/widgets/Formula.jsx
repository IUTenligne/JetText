var React = require('react');
var Modal = require('../widgets/Modal.jsx');


var Formula = React.createClass({
    getInitialState: function() {
        return {
            blockId: null,
            formulaString: '',
            formulaOverview: '',
            variables: [],
            selectedVariables: [],
            showAutocomplete: false,
            start: '@',
            matcher: /@(\w[\w.-]{0,59})\b$/i,
        };
    },

    componentDidMount: function() {
        this.setState({ blockId: this.props.blockId });
        this.serverRequest = $.get("/formulas.json", function (result) {
            this.setState({
                selectedVariables: result.formulas
            });
        }.bind(this));
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    composeFormula: function(event) {
        var str = event.target.value;

        this.setState({ formulaString: str });
        this.buildOverview(event.target.value);

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
        var variables = formula.match(this.state.matcher);

        this.setState({
            showAutocomplete: false,
            variables: [],
            selectedVariables: this.state.selectedVariables.concat([ variable ]),
            formulaString: formula,
            formulaOverview: str
        });
    },

    buildOverview: function(str) {
        var that = this;
        var o = str;
        for (var i in this.state.selectedVariables) {
            if (o.match(this.state.selectedVariables[i]["name"])) {
                o = o.replace(this.state.selectedVariables[i]["name"], this.state.selectedVariables[i]["value"]);
            }
        }

        this.setState({ formulaOverview: o });
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