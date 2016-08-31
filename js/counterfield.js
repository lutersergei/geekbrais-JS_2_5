function CounterField(selector, options) {
    var container = document.querySelector(selector);
    var input = document.createElement('input');
    if (options === undefined) options = {};
    this.incrementStep = options.incrementStep;
    if (this.incrementStep === undefined)
    {
        this.incrementStep = 1;
    }
    this.decrementStep = options.decrementStep;
    if (this.decrementStep === undefined)
    {
        this.decrementStep = 1;
    }
    this.minValue = options.minValue;
    this.maxValue = options.maxValue;
    this.defaultValue = options.defaultValue;
    if (this.defaultValue === undefined)
    {
        this.defaultValue = 1;
    }
    this.currentValue = this.defaultValue;
    input.onkeydown = function (event)
    {
        if (((event.keyCode<48)||(event.keyCode>57)) && (event.keyCode !== 8) && ((event.keyCode<96)||(event.keyCode>105)))
        {
            event.preventDefault();
        }
    };
    input.setAttribute('type', 'text');
    input.setAttribute('value', '1');
    input.setAttribute('id', 'difficulty');
    input.classList.add('form-control');
    var span = document.createElement('span');
    span.classList.add('input-group-btn');
    var buttonPlus  = document.createElement('button');
    buttonPlus.classList.add('btn', 'btn-default');
    buttonPlus.innerHTML = '+';
    var buttonMinus  = document.createElement('button');
    buttonMinus.classList.add('btn', 'btn-default');
    buttonMinus.innerHTML = '-';
    buttonPlus.onclick = increment;
    buttonMinus.onclick = decrement;
    container.appendChild(input);
    span.appendChild(buttonPlus);
    span.appendChild(buttonMinus);
    container.appendChild(span);
    var self = this;
    function increment () {
        input.value = +input.value + self.incrementStep;
        input.value = checkValue(input.value);
        self.currentValue = input.value;
    }
    function decrement () {
        input.value = +input.value - self.decrementStep;
        input.value = checkValue(input.value);
        self.currentValue = input.value;
    }
    function checkValue(value) {
        if ((self.minValue === undefined) && (self.maxValue === undefined))
        {
            return value;
        }
        //Проверка на правильность введеный минимум и максимум значений
        if (self.minValue >= self.maxValue)
        {
            return value;
        }
        if (self.minValue !== undefined)
        {
            if (value < self.minValue) value = self.minValue;
        }
        if (self.maxValue !== undefined)
        {
            if (value > self.maxValue) value = self.maxValue;
        }
        return value;
    }
}