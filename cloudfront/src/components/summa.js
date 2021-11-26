/**
 * Initiates a cold transfer.
 * If 3rd party picks up - agent disconnects
 * If 3rd party does not pick up - customer is left on-hold and agent stays connected.
 */
const coldTransferToDestination = function(endpoint){
    var contact = _getContact();
    holdConnection(connect.ConnectionType.INBOUND, function() {
        addConnection(contact, endpoint, function(){
            beginConference(function(){
                endConference(function(){
                    console.log("Cold transfer complete");
                })
            })
        });
    });
}

/**
 * Holds a connection and provides error handling.
 */
const holdConnection = function(connectionType, callback) {
    var contact = _getContact();
    var connection = _getConnectionByType(contact.getConnections(), connectionType);
    if(connection){
        if(!connection.isOnHold()) {
            connection.hold({
                success: function() {
                    if (callback) {
                        callback();
                    }
                },
                failure: function(e) {
                    console.error("connection hold error: " + e.message);
                }
            });
        } else {
            callback();
        }
    }
}

/**
 * Wrapper method for adding connections with error handling
 * Method executes callback when outbound connection connects.
 */
const addConnection = function(contact, endpoint, callback){
    contact.addConnection(endpoint,
        {
            success: function() {
                if(callback){
                    // Execute callback when outbound call is connected.
                    var bus = connect.core.getEventBus();
                    bus.subscribe(contact.getEventName(connect.ContactEvents.REFRESH), function(){
                        try {
                            var contact = _getContact();
                            if(contact){
                                var outbound = _getConnectionByType(
contact.getConnections(), connect.ConnectionType.OUTBOUND);
                                if(outbound && outbound.isConnecting()){
                                    // Still connecting, wait for next event
                                    return;
                                }
                                if(outbound && outbound.isConnected()){
                                    callback();
                                }
                            }

                            // Clean up subscription. 'this' is now the event
                            this.unsubscribe()
                        } catch (e) {
                            console.error("Error in addConnection:OnRefresh. " + e.message);
                        }
                    });
                }
            },
            failure: function(e) {
                console.error("Couldn't add connection to contact. " + e.message);
            }
        });
}

/**
 * Begins conference between Agent, Incoming (customer) and Outgoing (thirdParty)
 */
const beginConference = function(callback) {
    var contact = _getContact();
    if (contact) {
        contact.conferenceConnections(
            {
                success: function() {
                    if (callback) {
                        callback();
                    }
                },
                failure: function(e) {
                    console.error("Couldn't begin conference for contact. " + e.message);
                }
            });
    } else {
        console.error("Couldn't begin conference, there's no conversation.");
    }
}

/**
 * Disconnects agent from conference
 */
const endConference = function(callback) {
    var contact = _getContact();
    if (contact) {
        var agentConnection = contact.getAgentConnection();
        if (agentConnection) {
            agentConnection.destroy(
                {
                    success: function() {
                        if (callback) {
                            callback();
                        }
                    },
                    failure: function(e) {
                        console.error("Couldn't end agent connection to conference. " + e.message);
                    }
                });
        }
    } else {
        console.error("Couldn't end conference, there's no conversation.");
    }
}