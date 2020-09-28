class Console
{ 
  constructor(x, y, font)
  {
    this.x = x;
    this.y = y;
    this.active = false;
    this.font = font;
    this.chars = "";
    this.numChars = 0;
  }
  
  display()
  {
		strokeWeight(1);
		stroke(0);
    line(this.x - 5, this.y - this.font/1.3, this.x - 5, this.y + this.font/2.5);
    textSize(this.font);
		noStroke();
    text(this.chars, this.x, this.y + 6);
  }
  
  addChar(c)
  {
    this.chars += c;
    this.numChars++;
    changedText = true;
  }
  
  readLeftString()
  {
    let index = this.chars.indexOf("=");
    if (index != -1) {
      if (this.chars.substring(0, index) != null) {
        return this.chars.substring(0, index);
      }
    }
    return "";
  }
  readRightString() 
  {
    let index = this.chars.indexOf("=");
    if (index != -1) {
      if (this.chars.substring(index + 1, this.chars.length) != null) {
        return this.chars.substring(index + 1, this.chars.length);
      }
    }
    return "";
  }
  
  isActive()
  {
    return this.active;
  }
  
  activate()
  {
    this.active = true;
  }
  
  deactivate()
  {
    this.active = false;
  }
  
  reset()
  {
    this.chars = "";
  }
  
  deleteChar()
  {
    if (this.numChars > 0)
    {
      this.chars = this.chars.substring(0,this.chars.length-1);
      this.numChars -= 1;
    }
    changedText = true;
  }
}