$(document).ready(function(){
    const dietRestSelect = $("#dietary-restrictions-select");
    const dietRestFilterListElem = $("#dietary-restrictions-filter-list");
    let dietRestListArr = [];
    

    dietRestSelect.change(() => {
        if (dietRestListArr.indexOf(dietRestSelect.val()) === -1) {
            dietRestListArr.push(dietRestSelect.val());
            dietRestFilterListElem.append(`<div class="${dietRestSelect.val()}"><span class="remove-diet-restriction">X</span> <span class="remove-diet-restriction-value">${dietRestSelect.children("option:selected").text()}</p></div>`);
        }        
    });

    dietRestFilterListElem.on("click", "span.remove-diet-restriction", ()=> {
        let selectedOption = $("span.remove-diet-restriction").parent().attr("class");
        $("span.remove-diet-restriction").parent().remove();
        console.log('selectedOption :>> ', selectedOption);
        console.log('dietRestListArr.indexOf(selectedOption) :>> ', dietRestListArr.indexOf(selectedOption));
    });

  });