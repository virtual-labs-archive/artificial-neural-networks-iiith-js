/* 000 011...001 010
000 101...001 100
000 110...010 100
000 111...
001 110...
001 111...101 011
010 111...011 110
100 111...110 101 */
window.onload = function(){
	var s11 = 0;
	var s22 = 0;
	var s33 = 0;
	var s44 = 0;
	var s55 = 0;
	var s66 = 0;
	var s77 = 0;
	var s88 = 0;
	var count = 0;
	var n1 = 0;
	var n2 = 0;
	var w21 = 0;
	var w32 = 0;
	var w13 = 0;
	var t1 = 0;
	var t2 = 0;
	var t3 = 0;
	var all8 = [[0, 0, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0], [0, 1, 1], [1, 0, 1], [1, 1, 0], [1, 1, 1]];
	var valenergy = [];
	var ansarray = [];
	var arr1 = [];
	var arr2 = [];
	var map1 = new Map();

	var slider1 = document.getElementById("w12");
	var w12 = document.getElementById("demo1");
	var slider2 = document.getElementById("w23");
	var w23 = document.getElementById("demo2");
	var slider3 = document.getElementById("w31");
	var w31 = document.getElementById("demo3");
	var slider4 = document.getElementById("th1");
	var th1 = document.getElementById("demo4");
	var slider5 = document.getElementById("th2");
	var th2 = document.getElementById("demo5");
	var slider6 = document.getElementById("th3");
	var th3 = document.getElementById("demo6");

//calculating hamming distancebetween 2 energy states
	function hammDistance(value1, value2){
		var x = value1 ^ value2;
		var setBits = 0;
		while (x > 0) {
			setBits += x & 1;
			x >>= 1;
		}
		return setBits;
	}

//when button 000 is pressed
	function energy1(){
		s11 = 1;
		document.getElementById("e1").innerHTML = "<span style='color: blue;'>0 0 0</span>";
		count = count + 1;
		ansarray.push(0);
		ansarray.push(0);
		ansarray.push(0);
	}

//when button 001 is pressed
	function energy2(){
		s22 = 1;
		document.getElementById("e2").innerHTML = "<span style='color: blue;'>0 0 1</span>";
		count = count + 1;
		ansarray.push(0);
		ansarray.push(0);
		ansarray.push(1);
	}

//when button 010 is pressed
	function energy3(){
		s33 = 1;
		document.getElementById("e3").innerHTML = "<span style='color: blue;'>0 1 0</span>";
		count = count + 1;
		ansarray.push(0);
		ansarray.push(1);
		ansarray.push(0);
	}

//when button 100 is pressed
	function energy4(){
		s44 = 1;
		document.getElementById("e4").innerHTML = "<span style='color: blue;'>1 0 0</span>";
		count = count + 1;
		ansarray.push(1);
		ansarray.push(0);
		ansarray.push(0);
	}

//when button 011 is pressed
	function energy5(){
		s55 = 1;
		document.getElementById("e5").innerHTML = "<span style='color: blue;'>0 1 1</span>";
		count = count + 1;
		ansarray.push(0);
		ansarray.push(1);
		ansarray.push(1);
	}

//when button 101 is pressed
	function energy6(){
		s66 = 1;
		document.getElementById("e6").innerHTML = "<span style='color: blue;'>1 0 1</span>";
		count = count + 1;
		ansarray.push(1);
		ansarray.push(0);
		ansarray.push(1);
	}

//when button 110 is pressed
	function energy7(){
		s77 = 1;
		document.getElementById("e7").innerHTML = "<span style='color: blue;'>1 1 0</span>";
		count = count + 1;
		ansarray.push(1);
		ansarray.push(1);
		ansarray.push(0);
	}

//when button 111 is pressed
	function energy8(){
		s88 = 1;
		document.getElementById("e8").innerHTML = "<span style='color: blue;'>1 1 1</span>";
		count = count + 1;
		ansarray.push(1);
		ansarray.push(1);
		ansarray.push(1);
	}

//On clicking submit button
	function submit(){
		var j = 0;
		if(count !== 2){
			alert("Please select 2 States!");
			alert("Refresh the page and Start again!");
			return 0;
		}
		arr1[0] = ansarray[0];
		arr1[1] = ansarray[1];
		arr1[2] = ansarray[2];
		arr2[0] = ansarray[3];
		arr2[1] = ansarray[4];
		arr2[2] = ansarray[5];
		n1 = (4 * ansarray[0]) + (2 * ansarray[1]) + (1 * ansarray[2]);
		n2 = (4 * ansarray[3]) + (2 * ansarray[4]) + (1 * ansarray[5]);
		var hd = hammDistance(n1, n2);
		if(hd < 2){
			alert("Hamming distance for energy states should be more than 1!");
			alert("Refresh the page and Start again!");
			return 0;
		}
		document.getElementById("p1").style.display = "none";
		document.getElementById("p2").style.display = "none";
		document.getElementById("p3").style.display = "none";
		document.getElementById("submit").style.display = "none";
		document.getElementById("image").style.display = "none";
		document.getElementById("title").textContent = "HINT -->> W12=0.5; W23=0.6; W31=-0.5; Th1=0.4; Th2=-0.6; Th3=0.5";
		document.getElementById("column3").style.visibility = "visible";
		document.getElementById("explain").style.display = "none";
	}

	w12.textContent = slider1.value;
	slider1.oninput = function(){
		w21 = this.value;
		w12.textContent = this.value;
	};

	w23.textContent = slider2.value;
	slider2.oninput = function() {
		w32 = this.value;
		w23.textContent = this.value;
	};

	w31.textContent = slider3.value;
	slider3.oninput = function() {
		w13 = this.value;
		w31.textContent = this.value;
	};

	th1.textContent = slider4.value;
	slider4.oninput = function() {
		t1 = this.value;
		th1.textContent = this.value;
	};

	th2.textContent = slider5.value;
	slider5.oninput = function() {
		t2 = this.value;
		th2.textContent = this.value;
	};

	th3.textContent = slider6.value;
	slider6.oninput = function() {
		t3 = this.value;
		th3.textContent = this.value;
	};

//displaying the equations
	function showe(){
		if(arr2[0] === 0 && arr2[1] === 0 && arr2[2] === 0){
			document.getElementById("equation-2").textContent = "W12*(0) + W13*(0) <= th1 || W21*(0) + W23*(0) <= th2 || W31*(0) + W32*(0) <= th3";
		}
		else if(arr2[0] === 0 && arr2[1] === 0 && arr2[2] === 1){
			document.getElementById("equation-2").textContent = "W12*(0) + W13*(1) <= th1 || W21*(0) + W23*(1) <= th2 || W31*(0) + W32*(0) > th3";
		}
		else if(arr2[0] === 0 && arr2[1] === 1 && arr2[2] === 0){
			document.getElementById("equation-2").textContent = "W12*(1) + W13*(0) <= th1 || W21*(0) + W23*(0) > th2 || W31*(0) + W32*(1) <= th3";
		}
		else if(arr2[0] === 1 && arr2[1] === 0 && arr2[2] === 0){
			document.getElementById("equation-2").textContent = "W12*(0) + W13*(0) > th1 || W21*(1) + W23*(0) <= th2 || W31*(1) + W32*(0) <= th3";
		}
		else if(arr2[0] === 0 && arr2[1] === 1 && arr2[2] === 1){
			document.getElementById("equation-2").textContent = "W12*(1) + W13*(1) <= th1 || W21*(0) + W23*(1) > th2 || W31*(0) + W32*(1) > th3";
		}
		else if(arr2[0] === 1 && arr2[1] === 0 && arr2[2] === 1){
			document.getElementById("equation-2").textContent = "W12*(0) + W13*(1) > th1 || W21*(1) + W23*(1) <= th2 || W31*(1) + W32*(0) > th3";
		}
		else if(arr2[0] === 1 && arr2[1] === 1 && arr2[2] === 0){
			document.getElementById("equation-2").textContent = "W12*(1) + W13*(0) > th1 || W21*(1) + W23*(0) > th2 || W31*(1) + W32*(1) <= th3";
		}
		else if(arr2[0] === 1 && arr2[1] === 1 && arr2[2] === 1){
			document.getElementById("equation-2").textContent = "W12*(1) + W13*(1) > th1 || W21*(1) + W23*(1) > th2 || W31*(1) + W32*(1) > th3";
		}
	}

	function showequations(){
		if(s11 === 1){
			document.getElementById("equation-1").textContent = "W12*(0) + W13*(0) <= th1 || W21*(0) + W23*(0) <= th2 || W31*(0) + W32*(0) <= th3";
		}
		else if(s22 === 1){
			document.getElementById("equation-1").textContent = "W12*(0) + W13*(1) <= th1 || W21*(0) + W23*(1) <= th2 || W31*(0) + W32*(0) > th3";
		}
		else if(s33 === 1){
			document.getElementById("equation-1").textContent = "W12*(1) + W13*(0) <= th1 || W21*(0) + W23*(0) > th2 || W31*(0) + W32*(1) <= th3";
		}
		else if(s44 === 1){
			document.getElementById("equation-1").textContent = "W12*(0) + W13*(0) > th1 || W21*(1) + W23*(0) <= th2 || W31*(1) + W32*(0) <= th3";
		}
		else if(s55 === 1){
			document.getElementById("equation-1").textContent = "W12*(1) + W13*(1) <= th1 || W21*(0) + W23*(1) > th2 || W31*(0) + W32*(1) > th3";
		}
		else if(s66 === 1){
			document.getElementById("equation-1").textContent = "W12*(0) + W13*(1) > th1 || W21*(1) + W23*(1) <= th2 || W31*(1) + W32*(0) > th3";
		}
		else if(s77 === 1){
			document.getElementById("equation-1").textContent = "W12*(1) + W13*(0) > th1 || W21*(1) + W23*(0) > th2 || W31*(1) + W32*(1) <= th3";
		}
		else if(s88 === 1){
			document.getElementById("equation-1").textContent = "W12*(1) + W13*(1) > th1 || W21*(1) + W23*(1) > th2 || W31*(1) + W32*(1) > th3";
		}

		showe();
	}

//On clicking the Done button
	function done(){
		document.getElementById("column3").style.visibility = "hidden";
		document.getElementById("title").textContent = "";
		document.getElementById("column4").style.visibility = "visible";
	}

//Calculation of the energies
	function calculateEnergy(){
		var i = 0;
		var w11 = 0;
		var w22 = 0;
		var w33 = 0;
		var num = 0;
		for(i = 0; i < 8; i++){
			num = (-1/2 * ((w11 * all8[i][0] * all8[i][0]) + (w21 * all8[i][0] * all8[i][1]) + (w13 * all8[i][0] * all8[i][2]) + (w21 * all8[i][1] * all8[i][0]) + (w22 * all8[i][1] * all8[i][1]) + (w32 * all8[i][1] * all8[i][2]) + (w13 * all8[i][2] * all8[i][0]) + (w32 * all8[i][2] * all8[i][1]) + (w33 * all8[i][2] * all8[i][2]))) + ((all8[i][0] * t1) + (all8[i][1] * t2) + (all8[i][2] * t3));
			valenergy[i] = Math.round(num * 100) / 100;
		}
		map1.set("0 0 0" , valenergy[0]);
		map1.set("0 0 1" , valenergy[1]);
		map1.set("0 1 0" , valenergy[2]);
		map1.set("1 0 0" , valenergy[3]);
		map1.set("0 1 1" , valenergy[4]);
		map1.set("1 0 1" , valenergy[5]);
		map1.set("1 1 0" , valenergy[6]);
		map1.set("1 1 1" , valenergy[7]);
		var ar = [];
		var ra = [];
		const mapSort = new Map([...map1.entries()].sort((a, b) => b[1] - a[1])); 
		i = 0;
		for (var [key, value] of mapSort.entries()) { 
			ar[i] = key;
			ra[i] = value;
			i = i + 1; 
		}

		document.getElementById("ne1").textContent = ar[0];
		document.getElementById("ne2").textContent = ar[1];
		document.getElementById("ne3").textContent = ar[2];
		document.getElementById("ne4").textContent = ar[3];
		document.getElementById("ne5").textContent = ar[4];
		document.getElementById("ne6").textContent = ar[5];
		document.getElementById("ne7").textContent = ar[6];
		document.getElementById("ne8").textContent = ar[7];
		document.getElementById("en1").textContent = ra[0];
		document.getElementById("en2").textContent = ra[1];
		document.getElementById("en3").textContent = ra[2];
		document.getElementById("en4").textContent = ra[3];
		document.getElementById("en5").textContent = ra[4];
		document.getElementById("en6").textContent = ra[5];
		document.getElementById("en7").textContent = ra[6];
		document.getElementById("en8").textContent = ra[7];
		document.getElementById("calculate-energy").style.visibility = "hidden";
		document.getElementById("final").style.visibility = "visible";
	}

	function func1(){
		//for 001
		//for 000 011
		var flag1 = 0;
		var flag2 = 0;
		var x3 = 0;
		if(x3 > t3){
			flag1 = 1;
		}
		var x2 = 0;
		x2 = w32;
		if(x2 < t2){
			flag2 = 1;
		}
		if(flag1 && flag2){
			document.getElementById("show-final").textContent = "FINAL STATE IS 001";
		}		
		//for 010
		flag1 = 0;
		flag2 = 0;
		x2 = 0;
		if(x2 > t2){
			flag1 = 1;
		}
		x3 = 0;
		x3 = w32;
		if(x3 < t3){
			flag2 = 1;
		}
		if(flag1 && flag2){
			document.getElementById("show-final1").textContent = "FINAL STATE IS 010";
		}
		document.getElementById("show-final2").textContent = "SELECTED FINAL STATES ARE 000 AND 011";
	}

	function func2(){
		//for 001
		//for 000 101
		var flag1 = 0;
		var flag2 = 0;
		var x3 = 0;
		if(x3 > t3){
			flag1 = 1;
		}
		var x2 = 0;
		x2 = w13;
		if(x2 < t1){
			flag2 = 1;
		}
		if(flag1 && flag2){
			document.getElementById("show-final").textContent = "FINAL STATE IS 001";
		}		
		//for 100
		flag1 = 0;
		flag2 = 0;
		x2 = 0;
		if(x2 > t1){
			flag1 = 1;
		}
		x3 = 0;
		x3 = w13;
		if(x3 < t3){
			flag2 = 1;
		}
		if(flag1 && flag2){
			document.getElementById("show-final1").textContent = "FINAL STATE IS 100";
		}
		document.getElementById("show-final2").textContent = "SELECTED FINAL STATES ARE 000 AND 101";
	}

	function func3(){
		//for 010
		//for 000 110
		var flag1 = 0;
		var flag2 = 0;
		var x3 = 0;
		if(x3 > t2){
			flag1 = 1;
		}
		var x2 = 0;
		x2 = w21;
		if(x2 < t1){
			flag2 = 1;
		}
		if(flag1 && flag2){
			document.getElementById("show-final").textContent = "FINAL STATE IS 010";
		}		
		//for 100
		flag1 = 0;
		flag2 = 0;
		x2 = 0;
		if(x2 > t1){
			flag1 = 1;
		}
		x3 = 0;
		x3 = w21;
		if(x3 < t2){
			flag2 = 1;
		}
		if(flag1 && flag2){
			document.getElementById("show-final1").textContent = "FINAL STATE IS 100";
		}
		document.getElementById("show-final2").textContent = "SELECTED FINAL STATES ARE 000 AND 110";
	}

	function func4(){
		//for 000 111
		document.getElementById("show-final2").textContent = "SELECTED FINAL STATES ARE ONLY 000 AND 111";
	}

	function func5(){
		//for 001 110
		document.getElementById("show-final2").textContent = "SELECTED FINAL STATES ARE 001 AND 110";
	}

	function func6(){
		//for 101
		//for 001 111
		var flag1 = 0;
		var flag2 = 0;
		var x3 = 0;
		x3 = w13;
		if(x3 > t1){
			flag1 = 1;
		}
		var x2 = 0;
		x2 = w21 + w32;
		if(x2 < t2){
			flag2 = 1;
		}
		if(flag1 && flag2){
			document.getElementById("show-final").textContent = "FINAL STATE IS 101";
		}		
		//for 011
		flag1 = 0;
		flag2 = 0;
		x2 = 0;
		x2 = w32;
		if(x2 > t2){
			flag1 = 1;
		}
		x3 = 0;
		x3 = w21 + w13;
		if(x3 < t1){
			flag2 = 1;
		}
		if(flag1 && flag2){
			document.getElementById("show-final1").textContent = "FINAL STATE IS 011";
		}
		document.getElementById("show-final2").textContent = "SELECTED FINAL STATES ARE 001 AND 111";
	}

	function func7(){
		//for 110
		//for 010 111
		var flag1 = 0;
		var flag2 = 0;
		var x3 = 0;
		x3 = w21;
		if(x3 > t1){
			flag1 = 1;
		}
		var x2 = 0;
		x2 = w13 + w32;
		if(x2 < t3){
			flag2 = 1;
		}
		if(flag1 && flag2){
			document.getElementById("show-final").textContent = "FINAL STATE IS 110";
		}		
		//for 011
		flag1 = 0;
		flag2 = 0;
		x2 = 0;
		x2 = w32;
		if(x2 > t3){
			flag1 = 1;
		}
		x3 = 0;
		x3 = w21 + w13;
		if(x3 < t1){
			flag2 = 1;
		}
		if(flag1 && flag2){
			document.getElementById("show-final1").textContent = "FINAL STATE IS 011";
		}
		document.getElementById("show-final2").textContent = "SELECTED FINAL STATES ARE 010 AND 111";
	}

	function func8(){
		//for 101
		//for 100 111
		var flag1 = 0;
		var flag2 = 0;
		var x3 = 0;
		x3 = w13;
		if(x3 > t3){
			flag1 = 1;
		}
		var x2 = 0;
		x2 = w21 + w32;
		if(x2 < t2){
			flag2 = 1;
		}
		if(flag1 && flag2){
			document.getElementById("show-final").textContent = "FINAL STATE IS 101";
		}		
		//for 110
		flag1 = 0;
		flag2 = 0;
		x2 = 0;
		x2 = w21;
		if(x2 > t2){
			flag1 = 1;
		}
		x3 = 0;
		x3 = w32 + w13;
		if(x3 < t3){
			flag2 = 1;
		}
		if(flag1 && flag2){
			document.getElementById("show-final1").textContent = "FINAL STATE IS 110";
		}
		document.getElementById("show-final2").textContent = "SELECTED FINAL STATES ARE 100 AND 111";
	}

	function finalfunction(){
		if(s11 === 1 && s55 === 1){
			//000 011
			func1();
		}
		else if(s11 === 1 && s66 === 1){
			///000 101
			func2();
		}
		else if(s11 === 1 && s77 === 1){
			//000 110
			func3();
		}
		else if(s11 === 1 && s88 === 1){
			//000 111
			func4();
		}
		else if(s22 === 1 && s77 === 1){
			//001 110
			func5();
		}
		else if(s22 === 1 && s88 === 1){
			//001 111
			func6();
		}
		else if(s33 === 1 && s88 === 1){
			//010 111
			func7();
		}
		else if(s44 === 1 && s88 === 1){
			//100 111
			func8();
		}
	}

	var add = document.getElementById("e1");
	add.addEventListener("click", energy1);
	var add2 = document.getElementById("e2");
	add2.addEventListener("click", energy2);
	var add3 = document.getElementById("e3");
	add3.addEventListener("click", energy3);
	var add4 = document.getElementById("e4");
	add4.addEventListener("click", energy4);
	var add5 = document.getElementById("e5");
	add5.addEventListener("click", energy5);
	var add6 = document.getElementById("e6");
	add6.addEventListener("click", energy6);
	var add7 = document.getElementById("e7");
	add7.addEventListener("click", energy7);
	var add8 = document.getElementById("e8");
	add8.addEventListener("click", energy8);
	var sub = document.getElementById("submit");
	sub.addEventListener("click", submit);
	var se = document.getElementById("see-equations");
	se.addEventListener("click", showequations);
	var don = document.getElementById("done");
	don.addEventListener("click", done);
	var cn = document.getElementById("calculate-energy");
	cn.addEventListener("click", calculateEnergy);
	var fn = document.getElementById("final");
	fn.addEventListener("click", finalfunction);
};