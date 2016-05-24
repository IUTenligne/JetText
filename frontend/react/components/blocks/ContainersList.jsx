var React = require('react');

var ContainersList = React.createClass({
    getInitialState: function() {
        return {
            selectedItem: '',
            loading: false,
            pages: []
        };
    },

    itemSelection: function(item) {
        this.setState({ 
            selectedItem: item,
            loading: true 
        });

        this.serverRequest = $.get("/containers/"+item+".json", function (result) {
            this.setState({
                pages: result.pages,
                loading: false
            });
        }.bind(this));
    },

    exportItem: function(page) {
        $.ajax({
            url: "/blocks/export",
            type: "POST",
            context: this,
            data: {
                id: this.props.block,
                page_id: page
            },
            success: function() {
                this.props.closeModal();
            },
            error: function() {
                this.props.closeModal();
            }
        });
    },

    render: function() {
        var containers = this.props.containers;
        var that = this;

        return(
            <ul>
                { containers.map(function(container) {
                    return(
                        <li key={container.id} onClick={that.itemSelection.bind(that, container.id)}>{container.name}

                            { that.state.selectedItem === container.id
                                ? <ul className="selected-container-pages">
                                    { that.state.pages.map(function(page) {
                                        return(
                                            <li key={page.id} onClick={that.exportItem.bind(that, page.id)}>{page.name}</li>
                                        );
                                    })}
                                </ul>
                                : null 
                            }
                        </li>
                    );
                })}
            </ul>
        );
    }
});

module.exports = ContainersList;