$(window).ready(function () {

    var btn_save = $("#save-btn");

    btn_save.click(function () {
        var selects = $("#select-container select");
        console.log(selects.last().val());
        console.log(selects.last().prev().val());
        console.log(counterfield.currentValue);
    });

    function get_categories(parent)
    {
        var result = [];
        $.each(cook_categories, function(i, item)
        {

            if (parent === null)
            {
                if (item.parent_id === parent)
                {
                    result[0] = {
                        id: -1,
                        parent_id: parent,
                        title: "Без категорий"
                    };
                    result[result.length] = item;
                }
            }
            else
            {
                result[0] = {
                    id: -1,
                    parent_id: parent,
                    title: "Без подкатегорий"
                };
                if (item.parent_id === +parent) result[result.length] = item;
            }

        });
        return result;
    }

    function make_select_from_categories(data)
    {
        if (data.length > 1)
        {
            console.log(data);
            var select = $("<select/>");
            $.each(data, function(i, item){
                select.append($("<option/>",{text: item.title, value: item.id, "data-parent": item.parent_id}));
            });

            select.change(
                function()
                {
                    // console.log(get_categories($(this).val()));
                    while($(this).next().length)
                    {
                        $(this).next().remove();
                    }
                    $(this).after(make_select_from_categories(get_categories($(this).val())));
                }
            );

            return select;
        }
    }

    $('[for="category"]').after(make_select_from_categories(get_categories(null)));

    $("#photo-url").change(
        function(event)
        {
            $(".food-photo").prop("src",$(this).val());
        }
    );

    var counterfield = new CounterField('#counterfield_difficulty', {incrementStep: 1, decrementStep: 1, minValue: 1, maxValue: 5, defaultValue: 1});
});