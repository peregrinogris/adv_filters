FBL.ns(function() { with (FBL) {

const Cc = Components.classes;
const Ci = Components.interfaces;

var filtersActive = false;
var modifiedRows = [];
var currentFilter = /google/;

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
    },

    onToggleAdvFilters: function()
    {
        filtersActive = !filtersActive;

        if(!filtersActive)
        {
           removeFilter(modifiedRows);
        }
        else
        {
            var newFilter = prompt("Input desired filter RegExp. It'll be tested against the request's URL", currentFilter.source);
            if(newFilter)
                currentFilter = new RegExp(newFilter);

            applyFilter(modifiedRows, currentFilter);
        }
    }
});

// Net Panel Listener
function NetListener(){};

NetListener.prototype =
{
    onCreateRequestEntry: function(panel, row)
    {
        // Access file object that contains all info about the request
        // FBTrace.sysout("netPanelListener; " + row.repObject.href);

        // Customize UI.
        if(filtersActive)
        {
            applyFilter([row],currentFilter);
            //I save a refference to the modified row so I can enable or disable the styles later.
            modifiedRows.push(row);
        }
    }
};

//********************************************
//Helper Functions
function applyFilter(rows,regexp)
{
    var style ="", row;
    for(var i = 0; i < rows.length; i++)
    {
        row = rows[i];
        if(regexp.test(row.repObject.href))
            style = "background-color: orange; font-size: 12px; color: red";
        else
            style = "font-size: 8px;";

        row.setAttribute("style", style);
    }
};

function removeFilter(rows)
{
    for(var i = 0; i < rows.length; i++)
    {
        rows[i].setAttribute("style", "");
    }
};


// Registration
Firebug.registerModule(Firebug.NetListenerModule);

}});

