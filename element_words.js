var changedText = false;
var space = false;
var c;
var hs1;
var elements = [ "H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne",
                 "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", 
                 "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", 
                 "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr", 
                 "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", 
                 "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd", 
                 "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", 
                 "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", 
                 "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac", "Th", 
                 "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", 
                 "Md", "No", "Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", 
                 "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og" ];

var displayCase = 2;

function setup() {
  createCanvas(600, 400);
	
  hs1 = new HScrollbar(480, 50, 100, 20, 3);
	
  c = new Console(30, 50, 30);
  c.activate();
}

function MatchNextOneElement(prev, target) {
  if (prev.length >= target.length) {
    return prev;
  }
  for (let i = 0; i < elements.length; i++) {
    let element = elements[i];
    if (element.length != 1) {
      continue;
    }
    if (target.substring(prev.length, prev.length + 1).toLowerCase() === element.toLowerCase()) {
      prev += element;
      return prev;
    }
  }
  return "failed" + prev;
}

function MatchNextTwoElements(prev, target) {
  if (prev.length >= target.length) {
    return prev;
  }
  if (prev.length + 1 >= target.length) {
    return "failed" + prev;
  }
  for (let i = 0; i < elements.length; i++) {
    let element = elements[i];
    if (element.length != 2) {
      continue;
    }
    if (target.substring(prev.length, prev.length + 2).toLowerCase() === element.toLowerCase()) {
      prev += element;
      return prev;
    }
  }
  return "failed" + prev;
}

function RemoveDuplicates(input) {
  if (input.length == 0) {
    return input;
  }
  let tempList = new Array(0);
  for (let i = 0; i < input.length; i++) {
    let temp = input[i];
    if (!tempList.includes(temp)) {
      tempList.push(temp);
    }
  }
  return tempList;
}

//Outputs string
function AddSpaces(input) {
  if (input.length > 0) {
    let output = "" + input.charAt(0);
    if (input.length > 1) {
      for (let i = 1; i < input.length; i++) {
        let c = input.charAt(i);
        if (c >= 'A' && c <= 'Z') {
          output += " " + c;
        }
        else {
          output += c;
        }
      }
    }
    return output;
  }
  return "";
}

//Outputs array of strings
function AddSpacesToArray(input) {
  if (input.length > 0) {
    let output = new Array(0);
    let temp = "";
    for (let i = 0; i < input.length; i++) {
      let c = input.charAt(i);
      if (c >= 'A' && c <= 'Z') {
        if (temp.length > 0) {
          output = output.concat(temp);
        }
        temp = "" + c;
      }
      else {
        temp += c;
      }
    }
    output = output.concat(temp);
    return output;
  }
  else {
    return null;
  }
}

function draw() {
  //DrawHud();
  hs1.update();
  hs1.display();
  
  let oldDisplayCase = displayCase;
  displayCase = (int)(hs1.normalPos * 2 + 0.5);
  if (oldDisplayCase != displayCase) {
    changedText = true;
  }
  
  if (changedText) {
    changedText = false;
    
    background(200, 200, 200);
    
    //Draw HUD
    hs1.update();
    hs1.display();
    fill(0, 0, 0);
    textSize(20);
    noStroke();
    text("Word to Elementize", 30, 25);
    text("Display Mode", 465, 25);
		
    c.display();
    
    //Elementize word
    let targetWord = c.chars;
    let searching = true;
    let potentialList = new Array(0);
    let tempList = new Array(0);
    potentialList.push("");
    let failedList = new Array(0);
    while (searching) {
      for (let i = 0; i < potentialList.length; i++) {
        tempList.push(MatchNextOneElement(potentialList[i], targetWord));
        tempList.push(MatchNextTwoElements(potentialList[i], targetWord));
      }
      
      potentialList = new Array(0);
      
      //Add failed spellings to failedList
      for (let i = 0; i < tempList.length; i++) {
        let failedWord = tempList[i];
				//Remove "failed" from start
        if (failedWord.length > 6) {
          failedWord = failedWord.substring(6, failedWord.length);
          if (!failedList.includes(failedWord)) {
            failedList.push(failedWord);
          }
        }
      }
      
      //Remove all but the longest failed spellings
      let longestFail = 0;
      for (let i = 0; i < failedList.length; i++) {
        let temp = failedList[i];
        if (temp.length > longestFail) {
          longestFail = temp.length;
        }
      }
      for (let i = failedList.length - 1; i >= 0; i--) {
        let temp = failedList[i];
        if (temp.length < longestFail) {
          failedList.splice(i, 1);
        }
      }
      
      //Remove failed attempts to add an element symbol
      for (let j = 0; j < tempList.length; j++) {
        let temp = tempList[j];
        if (temp.length >= 6) {
          if (temp.substring(0, 6) !== "failed") {
            potentialList.push(temp);
          }
        }
        else {
          potentialList.push(temp);
        }
      }
      
      //If there are no more potential spellings, break the loop
      if (potentialList.length == 0) {
        searching = false;
      }
      //If all the element spellings are the proper length, break out of the loop
      else {
        for (let k = 0; k < potentialList.length; k++) {
          searching &= potentialList[k].length == targetWord.length;
        }
        searching = !searching;
      }
      
      tempList = new Array(0);
    }
    
    potentialList = RemoveDuplicates(potentialList);
    
    //---------------DISPLAY SPELLINGS---------------
    //Show working spelling(s), if any
    textSize(20);
    noStroke();
    strokeWeight(1);
    if (potentialList.length > 0) {
      potentialList = sort(potentialList);
      for (let i = 0; i < potentialList.length; i++) {
        if (displayCase == 0) { //Without spaces
          text(potentialList[i], 30, 90 + 30 * i);
        }
        else if (displayCase == 1) { //With spaces
          text(AddSpaces(potentialList[i]), 30, 90 + 30 * i);
        }
        else if (displayCase == 2) { //Boxes
          let oneWord = AddSpacesToArray(potentialList[i]);
          if (oneWord != null) {
            for (let x = 0; x < oneWord.length; x++) {
              if (oneWord[x].length == 1) {
                text(oneWord[x], 30 + 35 * x + 5, 90 + 30 * i);
              }
              else {
                text(oneWord[x], 30 + 35 * x, 90 + 30 * i);
              }
              noFill();
              stroke(0);
              rect(28 + 35 * x, 70 + 30 * i, 31, 28);
              fill(0, 0, 0);
              noStroke();
            }
          }
        }
      }
    }
    //Else show failed spellings
    else {
      fill(255, 0, 0);
      if (failedList.length > 0) {
        failedList = sort(failedList);
        for (let i = 0; i < failedList.length; i++) {
          if (displayCase == 0) { //Without spaces
            text(failedList[i], 30, 90 + 30 * i);
          }
          else if (displayCase == 1) { //With spaces
            text(AddSpaces(failedList[i]), 30, 90 + 30 * i);
          }
          else if (displayCase == 2) { //Boxes
            let oneWord = AddSpacesToArray(failedList[i]);
            if (oneWord != null) {
              for (let x = 0; x < oneWord.length; x++) {
                if (oneWord[x].length == 1) {
                  text(oneWord[x], 30 + 35 * x + 5, 90 + 30 * i);
                }
                else {
                  text(oneWord[x], 30 + 35 * x, 90 + 30 * i);
                }
                noFill();
                stroke(255, 0, 0);
                rect(28 + 35 * x, 70 + 30 * i, 31, 28);
                fill(255, 0, 0);
                noStroke();
              }
            }
          }
        }
      }
      else {
        text("Nothing found", 30, 90);
      }
      fill(0, 0, 0);
    }
    
    potentialList = new Array(0);
    failedList = new Array(0);
  }
}

function keyPressed() {
  if (keyCode == BACKSPACE)
  {
    c.deleteChar();
  }
  else if (keyCode == 32) {
    space = true;
  }
}

function keyTyped() {
  if (!space) {
    c.addChar(key);
  }
  space = false;
}
