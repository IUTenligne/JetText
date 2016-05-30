var React = require('react');
var TextBlock = require('./TextBlock.jsx');
var MediaBlock = require('./MediaBlock.jsx');
var NoteBlock = require('./NoteBlock.jsx');
var MathBlock = require('./MathBlock.jsx');
var Tooltip = require('../widgets/Tooltip.jsx');
var Modal = require('../widgets/Modal.jsx');
var Loader = require('../widgets/Loader.jsx');
var ContainersList = require('./ContainersList.jsx');
var NotificationSystem = require('react-notification-system');


var Block = React.createClass({
    getInitialState: function() {
        return {
            editBlock: true,
            tooltipState: false,
            modalState: false,
            helpModalState: false,
            loading: false,
            containersList: []
        };
    },

    componentDidMount: function() {
        this._notificationSystem = this.refs.notificationSystem;
    },

    removeBlock: function(event){
        var that = this;
        this._notificationSystem = this.refs.notificationSystem;

        for (name in CKEDITOR.instances) {
            CKEDITOR.instances[name].destroy(true);
        }

        // NotificationSystem popup
        event.preventDefault();
        this._notificationSystem.addNotification({
            title: 'Confirmer la suppression',
            message: 'Voulez-vous supprimer le bloc ?',
            level: 'success',
            position: 'tc',
            timeout: '10000',
            action: {
                label: 'yes',
                callback: function() {
                    $.ajax({
                        type: "DELETE",
                        url: "/blocks/" + that.props.item.id,
                        context: that,
                        success: function(data){
                            /* passes the deleted block_id to the parent (Page) to handle the DOM rerendering */
                            that.props.removeBlock(data.block);
                        }
                    });
                }
            }
        });
    },

    handleRemoveBlock: function(block){
        /* removes a block from the children (TextBlock, NoteBlock) */
        var that = this;
        this._notificationSystem = this.refs.notificationSystem;

        for (name in CKEDITOR.instances) {
            CKEDITOR.instances[name].destroy(true);
        }

        // NotificationSystem popup
        this._notificationSystem.addNotification({
            title: 'Confirmer la suppression',
            message: 'Voulez-vous supprimer le bloc ' +block.name+ '?',
            level: 'success',
            position: 'tc',
            timeout: '10000',
            action: {
                label: 'yes',
                callback: function() {
                    $.ajax({
                        type: "DELETE",
                        url: "/blocks/" + block.id,
                        context: that,
                        success: function(data){
                            /* passes the deleted block_id to the parent (Page) to handle the DOM rerendering */
                            that.props.removeBlock(data.block);
                        }
                    });
                }
            }
        });
    },

    editBlock: function() {
        this.setState({ editBlock: !this.state.editBlock });
    },

    handleBlockEditState: function(st) {
        this.setState({ editBlock: st });
    },

    handleBlockAdd: function(data) {
        /* updates the block list after a duplication on the same page */
        this.props.addBlock(data);
    },

    viewBlockAction: function() {
        this.setState({ tooltipState: !this.state.tooltipState });
    },

    handleTooltipState: function(st) {
        this.setState({ tooltipState: st });
    },

    handleHelpModalState: function() {
        this.setState({ helpModalState: !this.state.helpModalState });
    },

    exportBlock: function() {
        this.setState({
            modalState: true,
            loading: true
        });

        this.getContainers();
    },

    handleModalState: function(st) {
        this.setState({ modalState: st });
    },

    closeModal: function() {
        this.setState({ modalState: false });
    },

    getContainers: function() {
        this.serverRequest = $.get("/containers.json", function(result) {
            this.setState({
                containersList: result.containers,
                loading: false
            });
        }.bind(this));
    },

    _notificationSystem: null,

    render: function() {
        var block = this.props.item;

        if (block.type_id === 1) {
            return (
                <div className="block block-text" data-id={block.id}>
                    <TextBlock
                        block={block}
                        key={block.id}
                        containerId={this.props.containerId}
                        removeMe={this.handleRemoveBlock}
                        addBlock={this.handleBlockAdd}
                    />

                    <NotificationSystem ref="notificationSystem" />
                </div>
            );
        } else if (block.type_id === 2) {
            return (
                <div className="block block-media" data-id={block.id}>
                    <MediaBlock
                        block={block}
                        key={block.id}
                    />

                    { this.state.helpModalState
                        ? <Modal active={this.handleHelpModalState} mystyle={""} title={"Aide pour le bloc Média"}>
                                <div className="modal-in">
                                    Déposer un nouveau fichier :
                                    <ul>
                                        <li>cliquez sur l'icône <i className="fa fa-file-text"></i> ou glissez directement votre fichier par dessus.</li>
                                    </ul>
                                    <br /><br />
                                    Réemployer un fichier :
                                    <ul>
                                        <li>cliquez sur l'icône <i className="fa fa-folder-open"></i>.</li>
                                    </ul>
                                </div>
                            </Modal>
                        : null
                    }

                    <div className="action">
                        <i className="fa fa-cog" onClick={this.viewBlockAction} ></i>
                        <i className="fa fa-question-circle" onClick={this.handleHelpModalState} ></i>
                        <button className="handle" title="Déplacer le bloc"></button>
                    </div>

                    <Tooltip tooltipState={this.handleTooltipState}>
                        { this.state.tooltipState
                            ? <div className="block-actions">
                                <button className="btn-block" onClick={this.exportBlock}><i className="fa fa-files-o"></i> Dupliquer</button><br/>
                                <button className="btn-block" onClick={this.removeBlock}><i className="fa fa-remove"></i> Supprimer</button><br/>
                                <NotificationSystem ref="notificationSystem" />
                            </div>
                            : null
                        }
                    </Tooltip>

                    { this.state.modalState
                        ? <Modal active={this.handleModalState} mystyle={""} title={"Exporter le bloc"}>
                                <div className="modal-in">
                                    { this.state.loading
                                        ? <Loader />
                                        : <ContainersList
                                                closeModal={this.closeModal}
                                                containers={this.state.containersList}
                                                block={block.id}
                                                addBlock={this.handleBlockAdd}
                                            />
                                    }
                                </div>
                            </Modal>
                        : null
                    }
                </div>
            );
        } if (block.type_id === 3) {
            return (
                <div className="block block-note" data-id={block.id}>
                    <NoteBlock
                        block={block}
                        key={block.id}
                        containerId={this.props.containerId}
                        removeMe={this.handleRemoveBlock}
                        addBlock={this.handleBlockAdd}
                    />

                    <NotificationSystem ref="notificationSystem" />
                </div>
            );
        } if (block.type_id === 4) {
            return (
                <div className="block block-math" data-id={block.id}>
                    <MathBlock
                        block={block}
                        key={block.id}
                        containerId={this.props.containerId}
                        removeMe={this.handleRemoveBlock}
                        addBlock={this.handleBlockAdd}
                    />

                    <NotificationSystem ref="notificationSystem" />
                </div>
            );
        } else {
            return null;
        }
    }
});

module.exports = Block;
