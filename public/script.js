var names = new Array();

$(document).ready(function() {    
    $("#addmember").focus();
    $("#addmember").on("keyup", function(event) {
        if (event.which === 13) // ENTER
        {
            var name =  $(this).val();
            if (name.length>0){
                $(this).val("");
                var newUser = {
                    name: name.trim(),
                    sum: 0.0
                };
                names = names.concat(newUser);
                var header = createHeader();
                $("#matrix tr:first").remove();
                $("#matrix").prepend(header);
                var rows = $(".row");
                for (i = 0; i < rows.length; i++) {
                    $(rows[i]).append(createInputFor(newUser));
                }
            }
        }
    });
    $("#newline").on("click", addNewLine);
    $("#reset").on("click", reset);
    $(document).on("keyup", function(event) {
        if (event.which === 76 && event.ctrlKey === true) // L
            addNewLine();
        
        if (event.which === 82 && event.ctrlKey === true) // R
            reset();
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
        row.addClass("hide row");
        
        var descCell = $("<td></td>");
        var description = $("<input class='description'></input>");
        descCell.append(description);
        row.append(descCell);
        for(var i=0;i<names.length;i++){
            var cell = createInputFor(names[i]);
            row.append(cell);
        }
        $("#matrix").append(row);
        row.animate({"opacity": 1});
        description.focus();
    }
    
    function createInputFor(user){
        var input = $("<input>");
            input.addClass(user.name + " penger");
            input.on('change', calculate);
            var cell = $("<td>");
            cell.append($("<label>kr</label>"))
                .append(input);
        return cell;
    }

    function calculate() {
        $("#calculations").empty();
        for(var i = 0;i < names.length; i++) {
            calculateCostsFor(names[i]);
        }
        var sharePerUser = getTotalCost()/names.length;
        var transfers = new Array();
        while(transfers.length < 20) {
            var fromUser =  findLeastContributingUser();
            var receiver = findNextReceiver();
            var amount = calculateAmount(fromUser, receiver, sharePerUser);
            if (amount <= 0) {
                break;
            }
            transfers = transfers.concat({
                'from': fromUser,
                'to': receiver,
                'amount': amount
            });
            fromUser.sum += amount;
            receiver.sum -= amount;
        }
        for (i = 0; i < transfers.length; i++) {
            var t = transfers[i];
            if (t.amount > 0.5)
            {
                var trans = $("<p><strong>" + t.from.name + "</strong> skylder <strong>" 
                        + t.to.name + " " + t.amount + "kr</strong></p>");
                $("#calculations").append(trans);
            }
        }
        if (transfers.length === 0){
            $("#calculations").append($("<p>Status quo!</p>"))
        }
        $("#calculations").slideDown();
    }
    
    function calculateAmount(from, to, target) {
        var toDiff = to.sum - target;
        var fromDiff = target - from.sum;
        return round(Math.min(fromDiff, toDiff));
    }
    
    function findLeastContributingUser(){
        var user = names[0];
        for (i = 1; i < names.length; i++) {
            if (names[i].sum < user.sum){
                user = names[i];
            }
        }
        return user;
    }
    
    function findNextReceiver(){
        var user = names[0];
        for (i = 1; i < names.length; i++) {
            if (names[i].sum > user.sum){
                user = names[i];
            }
        }
        return user;
    }
    
    function calculateCostsFor(user) {
        user.sum = 0;
        var inp = $("input."+user.name);
        for (var j = 0; j < inp.length; j++) {
            user.sum += +$(inp[j]).val();
        }
    }
    
    function getTotalCost() {
        var sum = 0;
        for (i = 0; i < names.length; i++) {
            sum+= names[i].sum;
        }
        return sum;
    }
    
    function round(number){
        return Math.round(number*100)/100;
    }
    
    function reset() {
        names = new Array();
        $("#calculations").empty();
        $("#matrix").empty();
        $("#addmember").focus();
    }
});
