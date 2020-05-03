// var x, i, j, selElmnt, a, b, c;
// // -- x = select container
// // -- a = a div that contains selected item
// // -- b = a div that contains options
// // -- c = an option
// // -- selElmnt = 
// /* Look for any elements with the class "custom-select": */

// function transformOption() {
//   x = document.querySelector(".custom-select");
 
//     selElmnt = x.getElementsByTagName("select")[0];
//     /* For each element, create a new DIV that will act as the selected item: */
//     a = document.createElement("DIV");
//     a.setAttribute("class", "select-selected");
    
//     a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
//     x.appendChild(a);
//     /* For each element, create a new DIV that will contain the option list: */
//     b = document.createElement("DIV");
//     b.setAttribute("class", "select-items select-hide");
//     for (j = 1; j < selElmnt.length; j++) {
//       /* For each option in the original select element,
//       create a new DIV that will act as an option item: */
//       c = document.createElement("DIV");
//       c.innerHTML = selElmnt.options[j].innerHTML;
//       c.addEventListener("click", function(e) {
//           /* When an item is clicked, update the original select box,
//           and the selected item: */
//           console.log("event click");
//           var y, i, k, s, h;
//           s = this.parentNode.parentNode.getElementsByTagName("select")[0];
//           h = this.parentNode.previousSibling;
//           for (i = 0; i < s.length; i++) {
//             if (s.options[i].innerHTML == this.innerHTML) {
//               s.selectedIndex = i;
//               h.innerHTML = this.innerHTML;
//               y = this.parentNode.getElementsByClassName("same-as-selected");
//               for (k = 0; k < y.length; k++) {
//                 y[k].removeAttribute("class");
//               }
//               this.setAttribute("class", "same-as-selected");
//               console.log("selected index = " + s.selectedIndex);
//               break;
//             }
//           }
//           h.click();
//       });
//       b.appendChild(c);
//     }
//     x.appendChild(b);
//     a.addEventListener("click", function(e) {
//       /* When the select box is clicked, close any other select boxes,
//       and open/close the current select box: */
      
//       e.stopPropagation();
//       closeAllSelect(this);
//       this.nextSibling.classList.toggle("select-hide");
//       this.classList.toggle("select-arrow-active");
//     });
  

// }


// function closeAllSelect(elmnt) {
//   /* A function that will close all select boxes in the document,
//   except the current select box: */
// //   console.log(elmnt);
//   var x, y, i, arrNo = [];
//   x = document.getElementsByClassName("select-items");
//   y = document.getElementsByClassName("select-selected");
//   for (i = 0; i < y.length; i++) {
//     if (elmnt == y[i]) {
//       arrNo.push(i)
//     } else {
//       y[i].classList.remove("select-arrow-active");
//     }
//   }
//   for (i = 0; i < x.length; i++) {
//     if (arrNo.indexOf(i)) {
//       x[i].classList.add("select-hide");
//     }
//   }
// }

// /* If the user clicks anywhere outside the select box,
// then close all select boxes: */
// document.addEventListener("click", closeAllSelect);



function addElemToSelect(value) {
  var x = document.getElementById("datesSelector");
  var option = document.createElement("option");
  option.text = value;
  x.add(option);
}

document.getElementById("datesSelector").addEventListener("change", (e) => {
  // console.log("Selected index = " + e.target.selectedIndex + "Length = " + e.target.length);
  var selIndex = e.target.selectedIndex;
  currentTable = selIndex;
  for (var i = 0; i < e.target.length; i++) {
    var str = "tableCours" + i;
    if (i == selIndex) 
      document.getElementById(str).style.display = null;
    else
      document.getElementById(str).style.display = "none";
  }
    // var selectBox = document.getElementById("selectBox");
    // var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    // alert(selectedValue);
})

// function changeFunc() {
//   var selectBox = document.getElementById("datesSelector");
//   var selectedValue = selectBox.options[selectBox.selectedIndex].value;
//   alert(selectedValue);
//  }