$(window).ready(function () {

    var btn_save = $("#save-btn");;
    var selects;
    var checkbox;
    var photo;
    var cook_categories = {};

    btn_save.click(function () {
        selects = $("#select-container select");
        checkbox = $("#visibility");
        photo = $("#photo-url");
        console.log('checked?', checkbox.is(":checked"));
        console.log("Посл селект",selects.last().val());
        console.log("Атец селекта",selects.last().prev().val());
        console.log('сложность', counterfield.currentValue);
        console.log("FOTO",photo.val());
    });

    var aja = $.ajax({
        url: "/assets/json/category.json",
        type: "POST",
        dataType: "json",
        success: function (data) {
            cook_categories.categories = data.category;
            $('[for="category"]').after(make_select_from_categories(get_categories(null)));
        }
    });



    function get_categories(parent)
    {
        var result = [];
        $.each(cook_categories.categories, function(i, item)
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

    $("#photo-url").change(
        function(event)
        {
            $(".food-photo").prop("src",$(this).val());
        }
    );

    var counterfield = new CounterField('#counterfield_difficulty', {incrementStep: 1, decrementStep: 1, minValue: 1, maxValue: 5, defaultValue: 1});
});