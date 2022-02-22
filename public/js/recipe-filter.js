$(document).ready(function(){
    const dietRestrictionsSelect = $("#dietary-restrictions-select");
    const dietRestrictionsFilterListElem = $("#dietary-restrictions-filter-list");
    let dietRestrictionsListArr = [];
    

    dietRestrictionsSelect.change(() => {
        if (dietRestrictionsListArr.indexOf(dietRestrictionsSelect.val()) === -1) {
            dietRestrictionsListArr.push(dietRestrictionsSelect.val());
            dietRestrictionsFilterListElem.append(`<div class="${dietRestrictionsSelect.val()}"><span class="remove-diet-restriction">X</span> <span class="remove-diet-restriction-value">${dietRestrictionsSelect.children("option:selected").text()}</p></div>`);
            console.log(dietRestrictionsListArr);
        }        
    });

    dietRestrictionsFilterListElem.on("click", "span.remove-diet-restriction", (e)=> {
        let selectedOption = $(e.target).parent().attr("class");
        $(e.target).parent().remove();
        dietRestrictionsListArr.splice(dietRestrictionsListArr.indexOf(selectedOption), 1);
        console.log(dietRestrictionsListArr);
        });

  });