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
                    sum: 0.0
                };
                names = names.concat(newUser);
                var header = createHeader();
                $("#matrix tr:first").remove();
                $("#matrix").prepend(header);
                $(".row").each(function() {
                    $(this).append(creatInputFor(newUser))
                });
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
    
    function createInputFor(name){
        var input = $("<input>");
            input.addClass(names[i].name + " penger");
            input.on('change', beregnOppgjør);
            var cell = $("<td>");
            cell.append($("<label>kr</label>"))
                .append(input);
        return cell;
    }

    function beregnOppgjør() {
        $("#oppgjør").empty();
        for(var i = 0;i < names.length; i++) {
            calculateCostsFor(names[i]);
        }
        var sharePerUser = getTotalCost()/names.length;
        var transfers = new Array();
        while(!isDone(transfers) && transfers.length < 20) {
            var fromUser =  findLeastContributingUser();
            var receiver = findNextReceiver();
            var amount = calculateAmount(fromUser, receiver, sharePerUser);
            
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
                $("#oppgjør").append(trans);
            }
            else {
                alert(t.amount);
            }
        }
        $("#oppgjør").slideDown();
    }
    function calculateAmount(from, to, target) {
        var toDiff = to.sum - target;
        var fromDiff = target - from.sum;
        var amount = fromDiff;
        if (toDiff < fromDiff)
            amount = toDiff;
        return round(amount);
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
    
    function isDone(){
        var sum = names[0].sum;
        for (i = 1; i < names.length; i++) {
            if (Math.abs(names[i].sum - sum) >= 0.01)
                return false;
        }
        return true;
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
        $("#oppgjør").empty();
        $("#matrix").empty();
        $("#addmember").focus();
    }
});