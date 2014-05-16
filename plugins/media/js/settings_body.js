$j('input[type="submit"]').mousedown(function () {
            $j(this).css('background', '#a5a5a5');
        });
        $j('input[type="submit"]').mouseup(function () {
            $j(this).css('background', '#a5a5a5');
        });
        $j('#registration').click(function () {
            $j('.register').fadeToggle('slow');
        });
        $j('#loginform').click(function () {
            $j('.login').fadeToggle('slow');
        });
        $j(document).mouseup(function (e) {
            var container = $j(".login");
        if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) // ... nor a descendant of the container
        {
            container.hide();
        }
        container = $j(".register");
        if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) // ... nor a descendant of the container
        {
            container.hide();
        }
    });