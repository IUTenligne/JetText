var React = require('react');
var Modal = require('../widgets/Modal.jsx');


var Formula = React.createClass({
    getInitialState: function() {
        return {
            blockId: null,
            formulaString: '',
            formulaOverview: '',
            variables: [],
            filteredVariables: [],
            selectedVariables: [],
            showAutocomplete: false,
            start: '@',
            matcher: /@(\w[\w.-])\b/gi,
        };
    },

    componentDidMount: function() {
        this.setState({ blockId: this.props.blockId });
        this.serverRequest = $.get("/formulas.json", function(result) {
            this.setState({ variables: result.formulas });
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
            this.setState({ 
                showAutocomplete: true,
                filteredVariables: this.state.variables.filter( i => i["name"].match(searchedVar) )
            });
        }
    },

    selectVariable: function(variable) {
        var formula = this.state.formulaString.replace(this.state.matcher, "@"+variable.name+" ");

        this.setState({
            showAutocomplete: false,
            filteredVariables: [],
            selectedVariables: this.state.selectedVariables.concat([ variable ]),
            formulaString: formula
        });

        this.refs.formula.focus();
    },

    buildOverview: function(str) {
        var that = this;
        var o = str.match(this.state.matcher);

        var matches = [];
        var match = this.state.matcher.exec(str);
        while (match != null) {
            matches.push(match[1]);
            match = this.state.matcher.exec(str);
        }
        console.log(matches);
        /*for (var i in this.state.variables) {
            if (o.match(this.state.variables[i]["name"])) {
                o = o.replace("@" + this.state.variables[i]["name"], this.state.variables[i]["value"]);
            }
        }*/

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
                    <input ref="formula" type="text" value={this.state.formulaString} onChange={this.composeFormula} />
                </p>

                <div ref="formulaarea" dangerouslySetInnerHTML={{ __html: this.state.formulaOverview }} />

                { this.state.showAutocomplete && this.state.variables.length > 0
                    ? <div ref="autocomplete" id="mention-autocomplete">
                        <ul>
                            { this.state.filteredVariables.map(function(variable, index) {
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