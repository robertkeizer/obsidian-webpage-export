jQuery(function()
{
    // THEME TOGGLE
    if (localStorage.getItem("theme_toggle") != null)
    {
        if (localStorage.getItem("theme_toggle") == "true")
        {
            $(".toggle__input").prop("checked", true);
            $("body").addClass("theme-light");
            $("body").removeClass("theme-dark");
        }
    }

    if (localStorage.getItem("theme_toggle") == null && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)
    {
        $(".toggle__input").prop("checked", true);
        $("body").addClass("theme-light");
        $("body").removeClass("theme-dark");
        localStorage.setItem("theme_toggle", "true");
    }

    $(".toggle__input").on("click", function()
    {
        $('body').toggleClass('theme-light');
        $('body').toggleClass('theme-dark');

        if (localStorage.getItem("theme_toggle") == "true")
        {
            localStorage.setItem("theme_toggle", "false");
        }
        else
        {
            localStorage.setItem("theme_toggle", "true");
        }

        $(".toggle__input").prop("checked", localStorage.getItem("theme_toggle") == "true");
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        let newColorScheme = event.matches ? "theme-dark" : "theme-light";

        if (newColorScheme == "theme-dark")
        {
            $("body").addClass("theme-dark");
            $("body").removeClass("theme-light");
            $(".toggle__input").prop("checked", false);
            localStorage.setItem("theme_toggle", "false");
        }

        if (newColorScheme == "theme-light")
        {
            $("body").addClass("theme-light");
            $("body").removeClass("theme-dark");
            $(".toggle__input").prop("checked", true);
            localStorage.setItem("theme_toggle", "true");
        }
    });

    // MAKE CALLOUTS COLLAPSIBLE
    // if the callout title is clicked, toggle the display of .callout-content
    $(".callout.is-collapsible .callout-title").on("click", function()
    {
        var isCollapsed = $(this).parent().hasClass("is-collapsed");

        if (isCollapsed)
        {
            $(this).parent().toggleClass("is-collapsed");
        }

        $(this).parent().find(".callout-content").slideToggle(duration = 100, complete = function()
        {
            if (!isCollapsed)
            {
                $(this).parent().toggleClass("is-collapsed");
            }
        });
    });

    

    // MAKE HEADERS COLLAPSIBLE
    // if "heading-collapse-indicator" is clicked, toggle the display of every div until the next heading of the same or lower level

    function getHeadingContentsSelector(header)
    {
        let headingLevel = header.parent().prop("tagName").toLowerCase();
        let headingNumber = parseInt(headingLevel.replace("h", ""));

        let endingHeadings = [1, 2, 3, 4, 5, 6].filter(function(item)
        {
            return item <= headingNumber;
        }).map(function(item)
        {
            return `div:has(h${item})`;
        });

        let endingHeadingsSelector = endingHeadings.join(", ");

        return endingHeadingsSelector;
    }


    $(".heading-collapse-indicator").on("click", function()
    {
        var isCollapsed = $(this).parent().parent().hasClass("is-collapsed");
        
        $(this).parent().parent().toggleClass("is-collapsed");

        let selector = getHeadingContentsSelector($(this));

        if(isCollapsed)
        {
            $(this).parent().parent().nextUntil(selector).each(function()
            {
                $(this).show();
            });
            
            $(this).parent().parent().nextUntil(selector).each(function()
            {
                if ($(this).hasClass("is-collapsed"))
                {
                    let s = getHeadingContentsSelector($(this).children().first().children().first());
                    $(this).nextUntil(s).hide();
                }
            });
        }
        else
        {
            $(this).parent().parent().nextUntil(selector).hide();
        }
    });

    // Make button with id="#save-to-pdf" save the current page to a PDF file
    $("#save-pdf").on("click", function()
    {
        window.print();



        // $.ajax('/', function(list) {
        //     $.ajax({
        //         type: 'POST',
        //         url: '/save-pdf',
        //         body: 
        //         {
        //             html: document.documentElement.innerHTML,
        //             width: document.querySelector('meta[name="data-width"]').getAttribute("data-width"),
        //             height: document.querySelector('meta[name="data-height"]').getAttribute("data-height")
        //         },
        //         success: function(result) 
        //         {
        //             // result is the buffer of the PDF file
        //             console.log('Response:', result);

        //             // download the file
        //             var blob = new Blob([result], {type: 'application/pdf'});
        //             var link = document.createElement('a');
        //             link.href = window.URL.createObjectURL(blob);
        //             link.download = 'file.pdf';
        //             link.click();

        //             link.remove();

        //         }
        //     });
        // });
    });


    // MAKE OUTLINE COLLAPSIBLE
    // if "outline-header" is clicked, toggle the display of every div until the next heading of the same or lower level

    function getOutlineHeaderContentSelector(header)
    {
        let headingLevel = header.attr("data-size");
        let headingNumber = parseInt(headingLevel) ?? 6;

        let endingHeadings = [1, 2, 3, 4, 5, 6].filter(function(item)
        {
            return item <= headingNumber;
        }).map(function(item)
        {
            return `div.outline-control[data-size="${item}"]`;
        });

        let endingHeadingsSelector = endingHeadings.join(", ");

        return endingHeadingsSelector;
    }
    
    var outline_width = 0;

    $("div.outline-control").on("click", function()
    {
        var isCollapsed = $(this).hasClass("is-collapsed");
        
        $(this).toggleClass("is-collapsed");

        let selector = getOutlineHeaderContentSelector($(this));

        if(isCollapsed)
        {
            $(this).nextUntil(selector).each(function()
            {
                $(this).show();
            });
            
            $(this).nextUntil(selector).each(function()
            {
                if ($(this).hasClass("is-collapsed"))
                {
                    let s = getOutlineHeaderContentSelector($(this));

                    let array = $(this).nextUntil(s).toArray();

                    for (let i = 1; i < array.length; i++)
                    {
                        $(array[i]).hide();
                    }
                }
            });
        }
        else
        {
            let s = getOutlineHeaderContentSelector($(this));

            let array = $(this).nextUntil(s).toArray();

            for (let i = 1; i < array.length; i++)
            {
                $(array[i]).hide();
            }
        }

        $(".outline-container").width(outline_width);

    });

    // hide the control button if the header has no children
    $("div.outline-control").each(function()
    {
        let selector = getOutlineHeaderContentSelector($(this));

        if ($(this).nextUntil(selector).length == 1)
        {
            this.style.visibility = "hidden";
        }

        outline_width = $(".outline-container").width();
        $(".outline-container").width(outline_width);
    });

});