var names = new Array();

$(document).ready(function() {    
    $("#addmember").focus();
    $("#addmember").on("keyup", function(event) {
        if (event.which === 13){
            var name =  $(this).val();
            if (name.length>0){
                $(this).val("");
                var newUser = {
                    name: name.trim(),
                    sum: 0
                };
                names = names.concat(newUser);
                var header = createHeader();
                $("#matrix tr:first").remove();
                $("#matrix").prepend(header);
            }
        }
    });
    $("#newline").on("click", addNewLine);
    $("#reset").on("click", reset);
    $(document).on("keyup", function(event) {
        if (event.which === 76 && event.ctrlKey === true)
        {
            addNewLine();
        }
    });
    
    function createHeader() {
        var row = $("<tr>");
        row.append($("<th>beskrivelse</th>"));
        for(var i=0;i<names.length;i++){
            var cell = $("<th>");
            cell.append(names[i].name);
            row.append(cell);
        }
        return row;
    }

    function addNewLine() {
        var row =$("<tr>");
        row.addClass("hide");
        row.append($("<td><input class='description'></input></td>"));
        for(var i=0;i<names.length;i++){
            var input = $("<input>");
            input.addClass(names[i].name + " penger");
            input.on('change', beregnOppgjør);
            var cell = $("<td>");
            cell.append($("<label>kr</label>"))
                .append(input);
            row.append(cell);
        }
        $("#matrix").append(row);
        row.animate({"opacity": 1});
    }

    function beregnOppgjør() {
        $("#oppgjør").empty();
        for(var i = 0;i < names.length; i++) {
            calculateCostsFor(names[i]);
            $("#oppgjør").append($("<p>" + names[i].name + ": " + names[i].sum + "</p>"));
        }
        $("#oppgjør").slideDown();
    }

    function calculateCostsFor(user) {
        user.sum = 0;
        var inp = $("input."+user.name);
        for (var j = 0; j < inp.length; j++) {
            user.sum += +$(inp[j]).val();
        }
    }
    
    function reset() {
        names = new Array();
        $("#oppgjør").empty();
        $("#matrix").empty();
        $("#addmember").focus();
    }
});