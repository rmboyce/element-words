boolean changedText = false;
boolean space = false;
Console c = new Console(30, 50, 30);
HScrollbar hs1 = new HScrollbar(480, 50, 100, 20, 3);
String[] elements = { "H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne",
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
                      "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og" };

int displayCase = 2;

void setup() {
  size(600, 600);
  c.activate();
}

String MatchNextOneElement(String prev, String target) {
  if (prev.length() >= target.length()) {
    return prev;
  }
  for (int i = 0; i < elements.length; i++) {
    String element = elements[i];
    if (element.length() != 1) {
      continue;
    }
    if (target.substring(prev.length(), prev.length() + 1).toLowerCase().equals(element.toLowerCase())) {
      prev += element;
      return prev;
    }
  }
  return "failed" + prev;
}

String MatchNextTwoElements(String prev, String target) {
  if (prev.length() >= target.length()) {
    return prev;
  }
  if (prev.length() + 1 >= target.length()) {
    return "failed" + prev;
  }
  for (int i = 0; i < elements.length; i++) {
    String element = elements[i];
    if (element.length() != 2) {
      continue;
    }
    if (target.substring(prev.length(), prev.length() + 2).toLowerCase().equals(element.toLowerCase())) {
      prev += element;
      return prev;
    }
  }
  return "failed" + prev;
}

ArrayList<String> RemoveDuplicates(ArrayList<String> input) {
  if (input.size() == 0) {
    return input;
  }
  ArrayList<String> tempList = new ArrayList<String>();
  for (int i = 0; i < input.size(); i++) {
    String temp = input.get(i);
    if (!tempList.contains(temp)) {
      tempList.add(temp);
    }
  }
  return tempList;
}

String AddSpaces(String input) {
  if (input.length() > 0) {
    String output = "" + input.charAt(0);
    if (input.length() > 1) {
      for (int i = 1; i < input.length(); i++) {
        char c = input.charAt(i);
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

String[] AddSpacesToArray(String input) {
  if (input.length() > 0) {
    StringList output = new StringList();
    String temp = "";
    for (int i = 0; i < input.length(); i++) {
      char c = input.charAt(i);
      if (c >= 'A' && c <= 'Z') {
        if (temp.length() > 0) {
          output.append(temp);
        }
        temp = "" + c;
      }
      else {
        temp += c;
      }
    }
    output.append(temp);
    return output.array();
  }
  else {
    return null;
  }
}

void draw() {
  //DrawHud();
  hs1.update();
  hs1.display();
  
  int oldDisplayCase = displayCase;
  displayCase = (int)(hs1.normalPos * 2 + 0.5f);
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
    text("Word to Elementize", 30, 25);
    text("Display Mode", 465, 25);
    
    stroke(5);
    c.display();
    
    //Elementize word
    String targetWord = c.chars;
    boolean searching = true;
    ArrayList<String> potentialList = new ArrayList<String>();
    ArrayList<String> tempList = new ArrayList<String>();
    potentialList.add("");
    ArrayList<String> failedList = new ArrayList<String>();
    
    while (searching) {
      for (int i = 0; i < potentialList.size(); i++) {
        tempList.add(MatchNextOneElement(potentialList.get(i), targetWord));
        tempList.add(MatchNextTwoElements(potentialList.get(i), targetWord));
      }
      
      potentialList.clear();
      
      //Add failed spellings to failedList
      for (int i = 0; i < tempList.size(); i++) {
        String failedWord = tempList.get(i);
        if (failedWord.length() > 6) {
          failedWord = failedWord.substring(6, failedWord.length());
          if (!failedList.contains(failedWord)) {
            failedList.add(failedWord);
          }
        }
      }
      
      //Remove all but the longest failed spellings
      int longestFail = 0;
      for (int i = 0; i < failedList.size(); i++) {
        String temp = failedList.get(i);
        if (temp.length() > longestFail) {
          longestFail = temp.length();
        }
      }
      for (int i = failedList.size() - 1; i >= 0; i--) {
        String temp = failedList.get(i);
        if (temp.length() < longestFail) {
          failedList.remove(i);
        }
      }
      
      //Remove failed attempts to add an element symbol
      for (int j = 0; j < tempList.size(); j++) {
        String temp = tempList.get(j);
        if (temp.length() >= 6) {
          if (!temp.substring(0, 6).equals("failed")) {
            potentialList.add(temp);
          }
        }
        else {
          potentialList.add(temp);
        }
      }
      
      //If there are no more potential spellings, break the loop
      if (potentialList.size() == 0) {
        searching = false;
      }
      //If all the element spellings are the proper length, break out of the loop
      else {
        for (int k = 0; k < potentialList.size(); k++) {
          searching &= potentialList.get(k).length() == targetWord.length();
        }
        searching = !searching;
      }
      
      tempList.clear();
    }
    
    potentialList = RemoveDuplicates(potentialList);
    
    //---------------DISPLAY SPELLINGS---------------
    //Show working spelling(s), if any
    textSize(20);
    if (potentialList.size() > 0) {
      String[] potentialListArray = sort(potentialList.toArray(new String[potentialList.size()]));
      for (int i = 0; i < potentialListArray.length; i++) {
        if (displayCase == 0) { //Without spaces
          text(potentialListArray[i], 30, 90 + 30 * i);
        }
        else if (displayCase == 1) { //With spaces
          text(AddSpaces(potentialListArray[i]), 30, 90 + 30 * i);
        }
        else if (displayCase == 2) { //Boxes
          String[] oneWord = AddSpacesToArray(potentialListArray[i]);
          if (oneWord != null) {
            for (int x = 0; x < oneWord.length; x++) {
              if (oneWord[x].length() == 1) {
                text(oneWord[x], 30 + 35 * x + 5, 90 + 30 * i);
              }
              else {
                text(oneWord[x], 30 + 35 * x, 90 + 30 * i);
              }
              noFill();
              rect(28 + 35 * x, 70 + 30 * i, 31, 28);
              fill(0, 0, 0);
            }
          }
        }
      }
    }
    //Else show failed spellings
    else {
      fill(255, 0, 0);
      if (failedList.size() > 0) {
        String[] failedListArray = sort(failedList.toArray(new String[failedList.size()]));
        for (int i = 0; i < failedListArray.length; i++) {
          fill(255, 0, 0);
          stroke(255, 0, 0);
          if (displayCase == 0) { //Without spaces
            text(failedListArray[i], 30, 90 + 30 * i);
          }
          else if (displayCase == 1) { //With spaces
            text(AddSpaces(failedListArray[i]), 30, 90 + 30 * i);
          }
          else if (displayCase == 2) { //Boxes
            String[] oneWord = AddSpacesToArray(failedListArray[i]);
            if (oneWord != null) {
              for (int x = 0; x < oneWord.length; x++) {
                if (oneWord[x].length() == 1) {
                  text(oneWord[x], 30 + 35 * x + 5, 90 + 30 * i);
                }
                else {
                  text(oneWord[x], 30 + 35 * x, 90 + 30 * i);
                }
                noFill();
                rect(28 + 35 * x, 70 + 30 * i, 31, 28);
              }
            }
          }
          fill(0, 0, 0);
          stroke(0, 0, 0);
        }
      }
      else {
        text("Nothing found", 30, 90);
      }
      fill(0, 0, 0);
    }
    
    potentialList.clear();
    failedList.clear();
  }
}

void keyPressed() {
  if (keyCode == BACKSPACE)
  {
    c.deleteChar();
    space = true;
  }
  else if (keyCode == 32) {
    space = true;
  }
}

void keyTyped() {
  if (!space) {
    c.addChar(key);
  }
  space = false;
}
