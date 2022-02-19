$(document).ready(function(){
    const dietRestSelect = $("#dietary-restrictions-select");
    const dietRestFilterListElem = $("#dietary-restrictions-filter-list");
    let dietRestListArr = [];
    

    dietRestSelect.change(() => {
        if (dietRestListArr.indexOf(dietRestSelect.val()) === -1) {
            dietRestListArr.push(dietRestSelect.val());
            dietRestFilterListElem.append(`<p class="${dietRestSelect.val()}"><span class="remove-diet-restriction">X</span> ${dietRestSelect.children("option:selected").text()}</p>`);
        }        
    });

    $("span.remove-diet-restriction").click(()=> {
        console.log('CLICK :>> ');
        let selectedOption = this.parent().attr('class');
        console.log('selectedOption :>> ', selectedOption);
        console.log('dietRestListArr.indexOf(selectedOption) :>> ', dietRestListArr.indexOf(selectedOption));
    })

  });