FBL.ns(function() { with (FBL) {

const Cc = Components.classes;
const Ci = Components.interfaces;

// Module implementation
Firebug.NetListenerModule = extend(Firebug.Module,
{
    initialize: function(owner)
    {
        Firebug.Module.initialize.apply(this, arguments);

        // Register NetMonitor listener
        this.netListener = new NetListener();
        Firebug.NetMonitor.NetRequestTable.addListener(this.netListener);
    },

    shutdown: function()
    {
        Firebug.Module.shutdown.apply(this, arguments);

        // Unregister NetMonitor listener
        Firebug.NetMonitor.NetRequestTable.removeListener(this.netListener);
    }
});

// Net Panel Listener
function NetListener(){};

NetListener.prototype =
{
    onCreateRequestEntry: function(panel, row)
    {
        // Access file object that contains all info about the request
        FBTrace.sysout("netPanelListener; " + row.repObject.href);

        // Customize UI.
        if(/google/.test(row.repObject.href))
            row.setAttribute("style", "background-color: orange; font-size: 12px; color: red");
        else
            row.setAttribute("style", "font-size: 8px;");
    }
};

// Registration
Firebug.registerModule(Firebug.NetListenerModule);

}});

