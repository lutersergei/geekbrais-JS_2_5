$(window).ready(function () {

    var counterfield = new CounterField('#counterfield_difficulty', {incrementStep: 1, decrementStep: 1, minValue: 1, maxValue: 5, defaultValue: 1});

    var btn_save = $("#save-btn");;
    var selects;
    var checkbox;
    var photo;
    var title;
    var select_multiple;
    var cook_categories = {};
    var dish = {}; //блюдо

    $.ajax({
        url: "/assets/json/category.json",
        type: "POST",
        dataType: "json",
        success: function (data) {
            cook_categories.categories = data.category;
            $('[for="category"]').after(make_select_from_categories(get_categories(null)));
        }
    });

    $.ajax({
        url: "/assets/json/tags.json",
        type: "POST",
        dataType: "json",
        success: function (data) {
            createSelectTags(data)
        }
    });

    btn_save.click(function () {
        selects = $("#select-container select");
        checkbox = $("#visibility");
        photo = $("#photo-url");
        title = $("#title");

        dish.photo = photo.val();
        dish.title = title.val();
        dish.category = (selects.last().val() > 0) ? selects.last().val() : selects.last().prev().val();
        dish.visibility = checkbox.is(":checked");
        dish.difficulty = counterfield.currentValue;
        dish.tags = select_multiple.val();

        var dish_json = JSON.stringify(dish);

        $("#json").empty();

        $("#json").append(
            $("<kbd/>", {text: dish_json})
        )
    });

    $("#photo-url").change(
        function(event) {
            $(".food-photo").prop("src",$(this).val());
        }
    );


    var ingridients = [];

    function get_ingridients(i) {
        i++;
        $.ajax({
            url: "/assets/ingridients/" + i + ".txt",
            type: "POST",
            dataType: "text",
            success: function (data) {
                var ingridient = {};
                ingridient.id = i;
                ingridient.description = data;
                ingridients[ingridients.length] = ingridient;
                get_ingridients(i)
            },
            error: function () {
                console.log(ingridients);
                createPalette();
            }
        });
    }

    get_ingridients(0);

    function createPalette() {
        //TODO проверка на пустой массив

        var palette_container = $("#palette");
        $.each(ingridients, function (i, item) {
            palette_container.append(
                $("<div/>", {class: "thumbnail-container"}).append(
                    $("<div/>", {class: "image-cropper"}).append(
                        $("<a/>", {class: ""}).append(
                            $("<img/>", {src: "/assets/ingridients/" + item.id + ".jpg", alt: item.description})
                        )
                    )
                ).append(
                    $("<p/>", {text: item.description, class: "text-capitalize text-center"})
                )
            )
        })
    }

    function get_categories(parent)
    {
        var result = [];
        $.each(cook_categories.categories, function(i, item)
        {
            if (parent === null) {
                result[0] = {id: -1, parent_id: parent, title: "Без категорий"};
                if (item.parent_id === parent)
                {
                    result[result.length] = item;
                }
            }
            else
            {
                result[0] = {id: -1, parent_id: parent, title: "Без подкатегорий"};
                if (item.parent_id === +parent)
                {
                    result[result.length] = item;
                }
            }

        });
        return result;
    }

    function make_select_from_categories(data)
    {
        if (data.length > 1)
        {
            var select = $("<select/>").addClass("form-control");
            $.each(data, function(i, item){
                select.append($("<option/>",{text: item.title, value: item.id, "data-parent": item.parent_id}));
            });

            select.change(
                function() {
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

    function createSelectTags(data) {
        select_multiple = $("#tags");
        $.each(data.tags, function (i, item) {
            var option = $("<option/>", {value: item.id, text: item.title});
            select_multiple.append(option);
        })
    }
});