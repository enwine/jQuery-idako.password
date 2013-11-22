var
	jQuery = jQuery || {},
	console = console || {};

// IDAKO PASSWORD jQuery plugin
// Developed under MIT License, as follows:
//
// Copyright (c) 2013 Vicenç Gascó (vicenc@idako.us)

//
// BRIEF
//
// This jQuery plugin will let you show a color representation for passwords,
// that help users recognize their password before hitting submit.
// Bundled with the same package you can get password creation hinting.
// 
// This JS uses as a companion a CSS file that let's you define styles.
// You can freely modify any code in this or other files, and if you think that
// it may be relevant, please feel free to make a pull request in github.
//
// 
// FUNCTIONALITIES
//
// Use it as easy as: $('#myInput').idkpass();
// 

(function ($) {
	'use strict';
	var
		version = '0.1',
		release = new Date(2013, 10, 22, 10, 35, 0, 0);
	
	// First of all, we'll need to define how to convert an string to a color.
	String.prototype.toColorCode = function (amount) {
		var
			i,
			blockSize,
			colors = [],
			hexString = (function (string) {
				var
					j,
					str = '';
				for (j = string.length; j > 0; j -= 1) {
					str += string.charCodeAt(j - 1).toString(16);
				}
				return str;
			}(this)),
			summedString,
			tempStr;
		
		// Check how many colors were asked.
		if (isNaN(amount) || amount < 1) {
			amount = 1;
		}
		blockSize = 6 * amount;
		
		// Fill string to perform the operation
		while (hexString.length % blockSize !== 0) {
			hexString += "f";
		}
		
		// Digest to the desired block size
		while (hexString.length > blockSize) {
			for (i = 1; i <= blockSize; i += 1) {
				tempStr = (parseInt(hexString.charAt(hexString.length - i), 16)
								+  parseInt(hexString.charAt(hexString.length - i - blockSize), 16)).toString(16);
				tempStr = tempStr.substr(tempStr.length - 1, 1);
				hexString = tempStr + hexString;
			}
			hexString = hexString.substr(0, hexString.length - blockSize * 2);
		}
		
		// Explode into colors
		for (i = 0; i < amount; i += 1) {
			colors.push('#' + hexString.substr(i * 6, 6));
		}
		
		return colors;
	};
	
	$.fn.idako = $.fn.idako || {};
	$.fn.idako.password = function (options) {
		
		// Get default settings to work, extending with customs
		var
			settings = $.extend({
				displayBullets: false,
				bulletsAmount: 3,
				validate: true,
				minLength: 6,
				maxLength: 25,
				minNumbers: 2,
				minLetters: 2,
				minSpecialChars: 2,
				excludedStrings: [],
				regularExpression: null
			}, options),
			$container = this.wrap('<div class="idako-password"></div>').parent(),
			generateBullets = function () {
				var
					i,
					bulletsHtml = '<div class="idako-password-bullets">';
				for (i = 0; i < settings.bulletsAmount; i += 1) {
					bulletsHtml += '<div class="idako-password-bullet" data-bullet-id="' + i + '"></div>';
				}
				bulletsHtml += '</div>';
				return bulletsHtml;
				
			},
			bulletsHtml,
			bullets,
			$errors,
			inputValue;
		
		// Input verification
		if (this.prop('tagName').toLowerCase() !== 'input') {
			console.log('Cannot activate password in something that is not an INPUT.');
			return this;
		}
		if (this.attr('type').toLowerCase() !== 'password') {
			console.log('Cannot activate password in an INPUT that is not a password.');
			return this;
		}
		
		// Color bullets?
		if (settings.displayBullets === true) {
			$container.append(generateBullets());
			bullets = $('.idako-password-bullet');
			this.keyup(function () {
				var i, colors = $(this).val().toColorCode(settings.bulletsAmount);
				for (i = 0; i < colors.length; i += 1) {
					$(bullets[i]).css('background-color', colors[i]);
				}
			});
		}
		
		// Validation?
		if (settings.validate === true) {
			$container.append('<div class="idako-password-validation"><ul></ul></div>');
			$errors = $('.idako-password-validation ul');
			this.keyup(function () {
				inputValue = $(this).val();
				$errors.html('');
				// Check min size:
				if (inputValue.length < settings.minLength) {
					$errors.append('<li>Password is too short, at least ' + settings.minLength + ' characters.</li>');
				}
				// Check max size:
				if (inputValue.length > settings.maxLength) {
					$errors.append('<li>Password is too long, no more than ' + settings.maxLength + ' characters are allowed.</li>');
				}
				// Check numbers:
				if ((inputValue.match(/[0-9]/g) || []).length < settings.minNumbers) {
					$errors.append('<li>At least ' + settings.minNumbers + ' numbers are required.</li>');
				}
				// Check letters:
				if ((inputValue.match(/[a-zA-Z]/g) || []).length < settings.minLetters) {
					$errors.append('<li>At least ' + settings.minLetters + ' letters are required.</li>');
				}
				// Check specialchars:
				if (inputValue.length - (inputValue.match(/[0-9A-Za-z]/g) || []).length < settings.minSpecialChars) {
					$errors.append('<li>At least ' + settings.minSpecialChars + ' special characters are required.</li>');
				}
			});
		}
				
		return this;
	};
	$.fn.idkpass = $.fn.idako.password;
	
}(jQuery));