(function(window){

window.projectStyle =
{
	"" :
	{
		"position" : "absolute",
		"display"  : "none",
		"top"      : "20px",
		"left"     : "20px",
		"width"    : "370px",
		"z-index"  : 999999,
		"background" : "#fff",
		"-webkit-box-shadow": "0px 2px 10px 2px rgba(197, 197, 197, 0.40)",
		"-moz-box-shadow": "0px 2px 10px 2px rgba(197, 197, 197, 0.40)",
		"box-shadow": "0px 2px 10px 2px rgba(197, 197, 197, 0.40)",
		"border"    : "1px solid #e3e2e2",
		"font"      : "13px/14px Arial,sans-serif"
	},

	"sfheader" :
	{
		"display" : "block",
		"color"   :"#5e5e5e",
		"font-size":"30px",
		"padding" : "30px 0px 14px 20px",
		"overflow":"hidden",
		"width"   :"300px",
		"text-shadow": "rgba(255, 255, 255, 0.5) 0 1px 1px, rgba(255, 255, 255, 0.2) 1px 1px 1px",
		"height"  :"16px"
	},

	"sfcontainer":
	{
		"color"  : "#5e5e5e",
		"padding": "12px 0 14px",
		"margin" : "14px 30px 0 20px",
		"border-top" : "1px solid #ccc",
		"display" : "block"
	},

	".clear":
	{
		"clear" : "both",
		"height" : 0
	},

	"sffooter":
	{
		"text-align": "right",
		"display" : "block",
		"position" : "relative",
		"padding"   : "6px 30px 20px 20px"
	},

	".SFinputBox":
	{
		"border"        : "1px solid #999",
		"border-right"  : "0",
		"display"       : "block",
		"border-bottom" : "0",
		"font-size"     : "16px",
		"color"         : "#5e5e5e",
		"padding"       : "16px 8px",
		"margin"        : "16px 0",
		"background"    : "#f1f1f1"
	},

	"#SFloginWrapper, #SFEmailWrapper":
	{
		"background-image" : "url(data:;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAeCAYAAAAy2w7YAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABJ5JREFUeNqMVj+InUUQn3n5CBwvCBaJQnLkjpN4hAiRcI0QTsQmaXJFKkOEIEEOIVhEe5tUYsQmVUqtBcEUgnhJEUI4iGBxQrpEUNOI3ONE3Bl/82f325eA5nvM293Zmd3589vZ5XcvXqTn+N4CbYDeBL2avJ9BP4C+Bn3/fwsMz7HJFdBV0OJT/NeSzIBPQV/850aqREyKHz5mItV+/j0wr4E59WmQ+l+MmNXEF9G9Bt4MvJsxY+txa01hoioQ1iDp+qqraDbRTqny7CdEMRYSqXo6RbupJKvOd0m0ZlCuP7hgs3LuOwPmKfKpEAhnRyu9oaZ7Ci10aKfj1ViZR+gW7N88a16tS3oSc9LmbCzhCUmpMk7rLlNiziJU1xjMfUKsWdhddvvZ7ThprmparpEVD4nnQVPevJLmwMkxQxYptqV9s8EsMClNJ5kaHo50/vsnGbQ+JKHbviOV7ybrKD961Clkzh7DnqPVG0ocuRcavjXuKPM4VuC2nnvHFB7pXF41d6IH6B/VMA3C3HldAxgWB7p8wwehPvrICTZ4JNSdpH67LcyfqxaojPNIJ9W1GmLZob81hjqENGKOjTQ2Iu2SEavfgtgFg213Rse81B04W+FttLdiHOen/yYGTyl2+KTBOOArO6AbQMys2EGWkPPWKQ+stUVmquUGeDtqa5USkJdaBKR61B+8mmyPtZWUKUZXob7oYEhINvAwPfJap3qz5cu8ksxfwn9QKYGcxABnuiX2tBr3CIvcA2uCuZdg4xAniv6BwG8I4T2TwRhliGaBMh4znpkZSkBmzsosMu+gewHjs9XbHpkclf8w+ufRnsf4W7Rfgr6Kujhm24IwaLdRovQwmg+x6RWM9/fljBtmuSvyTfcstn8bvdfh0efY7JdOnPYtLy8nirxULMGWT9D5AIL7KGtYKwK1giu1mkdZYjR2Np030H0REz9i/Ael7OCo8dwwrgP6GCqXRsvDRY2CRS27rM1HL2HPIvoSvPsLmf4IczMTDdSZYczvQ2uTMpFep9pNR/MBbPGUVlTn+X6+cD/RQ8x9ZnpR64jWMHmZcwPq5J++qLjdSxVVFSVckZQGOiAuo3cHdN9DZ6gBc5W7pOdVXCzu2jgNrRWnrXy7LENW+/LEq+hjbb0/QeiWisqGeVLaxWanuuxi7jr6e+h3lSOrggOg1Ot8z2RL0V3jl6weViWKlg0ge8lCdxp2HZMG0xaXbfUirQt9isZ7aJRHdyGuK92GV+tznisdg8RpgEHXIu7cMJ942obv067eJ0jyLsproyvfU6ATOrRe7+K6JnTXJsjRCXGs55tAguDpXYTjYH0fSIaD8v4Kvlme85BFiO76W8FfSFT5pnfCHicr/TNLxufWFuj4+GDp8qfSHh8qTf546sTjpBodcysWukPPlhn9Ff0nGK3w3IzOl6K88DI+K+Q6ZLovs2p3z9GhCWl9Gmn33KLbELBystBZHOWof2Ra/oWq/oKVLdDtWJP66PgD0t7Pr/jbWukglvodqt943SL6CfQC+AcSffs16plZaWfsb/D30O6i/dONi7f6d+YFxk+U/L56+K8AAwDi6kALmq56DQAAAABJRU5ErkJggg==)",
		"background-repeat": "no-repeat",
		"background-position":"286px 12px"
	},

	"#SFpasswordWrapper":
	{
		"background-image" : "url(data:;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAeCAYAAAAo5+5WAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAx1JREFUeNp8VjtuG0EMJY0tDbgM4Cqt06YJdAD7EnJKbeMuaVPlCmnkc7iJWwPp1EatqwA5hMnwO6RWUmRTGs5wOOTj4+zi5/t7+M/nVuROZCVyE3N7kV8iP0Wez22czsy/F3kQmUUuF2ufQjYiW5EfIq9Hjpl5MYXq9DsAr2UsfwyMMsOqQY0RLmXrF9HeycI3mX51V75nAtG6a5l8YMC1OYRYCwN1iqSqrLJ7l8FaJv7K8le2o8nsLkgdl9yKPjMTLOZVdky883n1Lr9EuTbL/K3Om06sUJBFYBky3GmKFb9F/EdWH+X3t2Yh4XyQiDYyvjZwLHKBBVCL/IyRyaS/DBTgwYrtAIZAVI2eZP1J1neAFt1HGV8z8iYh8qB4he7J9AvSdCR0svTpRnVLFzItelEIDB6zUzhsDhIy86F7AzbVJzX2yltaV1YQ/ZBHLSt7C8G/wOGAPamOAZfT4QpHnQ2KN8MYknZWGEfGsGfYuQNPktzXDlGjtHVnS1YknFvEEFxFxkNuKRyNbu7FVQ+WR1CdsuGY3IokSSdpVQT6QVAdokWkXKdWaBjhR8RgzEdz7jSvjdEIA59whH6S/UBRNg+YyD1EYDT7PEac4YQrKseUtbizWSKPgmV+yuXJuqeyf0wu1Cej4aFp5GprHcCFLEIdMr0R2S3V0Byo9XJQgz5KtrhjoNnwrBFvFUPiw4QI6qYKjqeW/F4cXUdIVltjRWvgRgaMyMpRoJxsbilUHs7vYEVuGn0ylEZ6DAZgcjuYQVCM0DVKuknnjXLlFxcf89oFaskjL/Ov/Yc8XvYN1gFQ3d5NqoWxARWLlJ23YAHDeDrAov8aA3BQjAbdys4aRO8Iik4KhlsXjrshb7zAhYIh+p9jh3ykog0ST7aDhxu0OQiqpQmPrDDLcQK2cVfgKEpVLF1gUM+XcNgmOzh0bGDZM2/cUY1eVbFCMbPitM30kxB5nyH7ewUfdU/vFj75RjOYycfVZU7HydVDj203Vl3PnnLqTYgXPDw6oopDvRT9mbDI8kJfNvKRn9HnGI5fWiKIGh/YwPAx/xNgAG07r9fJIPMgAAAAAElFTkSuQmCC)",
		"background-repeat": "no-repeat",
		"background-position":"286px 12px"
	},

	"#SFloginWrapper sflabel, #SFpasswordWrapper sflabel, #SFEmailWrapper sflabel" :
	{
		"float" : "left",
		"width" : "50px",
		"padding" : "6px 0 0 0"
	},

	"#SFloginWrapper sfinput, #SFpasswordWrapper sfinput, #SFEmailWrapper sfinput" :
	{
		"width" : "160px",
		"height" : "14px",
		"display" : "block",
		"margin" : "0 0 0 84px",
		"cursor" : "text",
		"border-bottom" : "1px solid #ccc",
		"overflow" : "hidden",
		"padding" : "4px 6px",
		"white-space" : "nowrap"
	},

	"#SFloginWrapper sfinput:focus, #SFpasswordWrapper sfinput:focus, #SFEmailWrapper sfinput:focus" :
	{
		"background" : "#fff",
		"outline" : "0",
		"-webkit-box-shadow": "0px 1px 6px 2px rgba(0, 0, 0, 0.1)",
		"-moz-box-shadow": "0px 1px 6px 2px rgba(0, 0, 0, 0.1)",
		"box-shadow": "0px 1px 6px 2px rgba(0, 0, 0, 0.1)"
	},

	"#SFloginWrapper sfinput.sf-error, #SFpasswordWrapper sfinput.sf-error, #SFEmailWrapper sfinput.sf-error" :
	{
		"color" : "red",
		"border-bottom":"1px solid red"
	},

	"#SFAjaxLoader" :
	{
		"background-image"    : "url(data:;base64,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)",
		"background-repeat"   : "no-repeat",
		"background-position" : "0 0",
		"position" : "absolute",
		"right" : "86px",
		"display" : "none",
		"top"   : "10px",
		"height": "36px",
		"width" : "36px"
	},

	"#SFButtonLogin" :
	{
		"width"   : "42px",
		"cursor"  : "pointer",
		"height"  : "42px",
		"display" : "inline-block",
		"background" : "#606060 url(data:;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAWCAIAAACQbVFOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAWBJREFUeNqMkyGTglAUhXcVCoVipjDjWJxhKBaKxUo28xecMRMZfgPZilWrFAJWLQQIFAmWLZT9du+OgyyD3hnevAfnnHvufZfPzWbz9Rsfb8RoMpmEYeg4zltoHk3TPM/bbrcwX6MlZrOZ7/ur1WoAPbYsy7Zt5DmoqjqfzznmeX6/33vQ0+k0SZKmadCWV7quL5dLNtfrtUcbKB/gGIbxsA6Z0suyvN1uT2jZ0UQI0MCJMVYIrBhD8QktgdLxeGRDHspgY5rmYrGo67qqqi5aggxpmqIKR5JAYO1Hi7Hz+QwNAnXzBjOj4esoiuJyuTyOygCUEtfrtVQs2frRtAWcmJY4HA77/b6LRglce8gwE0URa9eJ67rMySM1Eccxkl3fpGYM2zNIcUi2L/IHLePKJLV7hx5G/9ejUEobmmXZbrfrSPZ0EElSgx7o6R/6dDoh+fLvVEAEQdC+sIH4FmAA0Xatq4VCUDEAAAAASUVORK5CYII=) center center no-repeat"
	},

	".SFButtonText" :
	{
		"background" : "#606060",
		"padding" : "14px",
		"font-size" : "14px",
		"display" : "inline-block",
		"color" : "#fff",
		"cursor" : "pointer"
	},

	"sful, sfli" :
	{
		"display" : "block"
	},

	"sful":
	{
		"padding"    : "10px 10px 16px",
		"font-size"  : "16px"
	},

	"sfli" :
	{
		"padding" : "8px 14px",
		"background-color" : "#eee",
		"margin" : "8px 0 8px",
		"cursor" : "pointer"
	},

	"sfli.sfhover":
	{
		"background" : "#fff",
		"outline" : "0",
		"-webkit-box-shadow": "0px 1px 15px 4px rgba(0, 0, 0, 0.1)",
		"-moz-box-shadow": "0px 1px 15px 4px rgba(0, 0, 0, 0.1)",
		"box-shadow": "0px 1px 15px 4px rgba(0, 0, 0, 0.1)"
	},

	"sfli.newMessage":
	{
		"background-image" : "url(data:;base64,R0lGODlhEwATAPYpAN7e3uDg4OPj4+Tk5Ofn5+rq6uzs7Pb29v7+/v90AP91Avt1Bv94B/p6D/d7FP9+Ev1+Ff+FIfyJKv+SNvOTQv+dTP+fT/CZUv+nXfeoZv+wbP/Cj+jAnuTGrP7VtP/au83NzdHR0dXV1djY2P/gxe3m3/Dw8Pj4+Pv7+1i8Qlm9Q16/SF+/SWTBT2fCUm/FW3zLaoXOdIrQeozRfZbViJ/ZkqDZk7Lgp7firbjirs/Pz87rx9Ptzdrw1evr6+/v7/z8/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtJQ0NSR0JHMTAxMkgAAAxITGlubwIQAABtbnRyUkdCIFhZWiAHzgACAAkABgAxAABhY3NwTVNGVAAAAABJRUMgc1JHQgAAAAAAAAAAAAAAAQAA9tYAIfkEBTIAKQAsAAAAABMAEwAABrfAlDBlKhoNRtNwaCKMQqCoFBQaFZRCU4AKCBC+gzAhQMYSQKOver02EEUhdeGAqJ8K6kABCQJ8DQgkFg8QGghNakUgXwUIGwwKCZIRHnhfil8HHwqRkpIVBokmIAMEKBieqQyhXpimE6mpJaKLAyiwsQkLlgSuBxq5CRRrrgUoErEOHHmKpQRXGRAJDRcdXqIiAmwBAgAA2gSlVyljBOBs4WpuRNfo589YRAV473JIS1kmSEn7S0EAIfkEBTIACQAsAAACABMAEQAAB36ACYKDhASGhIiJCQGGjQQFiogHhQQ/ij0zLS41gowCkTgrKimkLzsGkQk8KqMprCoyiJaDNKS2pCuChgazCUAwt7eDn4jAwa6pCTaswTDJCC+tpCw3jQKWOog0LiksMTnJiAEAAAMDh4QABIyNBY4EA+GDhgKGPvLE8j+9kYEAOw==)",
		"background-position" : "6px 5px",
		"padding-left" : "32px",
		"background-repeat" : "no-repeat"
	},

	"sfdiv.sfmessage":
	{
		"font-size" : "16px",
		"padding" : "14px",
		"display" : "block"
	},

	"sfcheckbox":
	{
		"padding" : "4px 0 4px 24px",
		"cursor"  : "pointer",
		"display" : "inline-block"
	},

	"sfcheckbox.sfactive":
	{
		"background" : "url(data:;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAOCAYAAAD0f5bSAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAWlJREFUeNqEUT1rwlAUPe+ZPL8lIOggggQcFFzFQfwBWfIXujs7FTqUToX2NxT8D84RFyfBH1EyOURNEFTSex9NSIu2F877PPfc+84T6/VaAXgiPAghWrgTcRx/0vRBeDaI+EKLWaVSQS6Xu5eD6/XaOh6Pj7RUBsW0XC6DZpCAxo0qiKIILHw6naaSSCWlFBj5fF6jUCikCIIAy+VSz8VikUVLBrfECVxJSplWYvXVaoXNZoPxeIxer4fL5aKfIHlg+L6vycne8zyd0Ol0MBwO03OGweoMbms+n2M0GoHfuN1utchkMkkNSrhG8thms4l+v4/FYpGSut0uGo2GbjUbMrvhKrZts716PxgMbtovWSULx3FgWZZut91u4/c9QxvBriQH7KTrutotvsuSE/cEuRYeDodSrVaDaZo/PjT70efzGfv9HtVqNRLU/+tut5uFYYj/gl2t1+vvrKgIbwQ//jv8b576EmAAYIvHdnEuEsMAAAAASUVORK5CYII=)",
		"background-repeat" : "no-repeat",
		"background-position" : "4px 5px"
	},

	"sfcheckbox.sfempty":
	{
		"background" : "url(data:;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAOCAYAAAD0f5bSAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAN5JREFUeNqcUjEOgzAMdELkAZAYGPlcP8FUqUPVqVL7hj6HhWdUTGwkE5DaUd2BQqh60smB3MXhjGqaBgHgRDwopSrYgPf+SeVBPBsSXmhR53kOSZJseWCapmoYhiMtUbVta7MsS40xQAcErnQJHMcRrLWOO6WICGzSWn8ZxTDPc9h3zqWGr7Q0rXUSE+uDSRgz8XuuwcRCYSwIhujM8sRfoOEPGElHGBnuhyEIzp/rnkl0uigKit7xxKNX4n3WsV7Rw7Xv+5omvfst9OdAWZZ3bovEG7HzcXRvHb4EGABjjaZF3tD82AAAAABJRU5ErkJggg==)",
		"background-repeat" : "no-repeat",
		"background-position" : "4px 5px"
	},

	"#SFChat":
	{
		"display" : "block",
		"overflow": "hidden",
		"overflow-y" : "auto",
		"height" : "250px"
	},

	"#chatTextarea":
	{
		"display" : "block",
		"margin" : "16px 0",
		"border" : "1px solid #ccc",
		"padding" : "6px 12px",
		"font-size" : "14px",
		"line-height" : "18px",
		"height" : "74px",
		"word-wrap": "break-word",
		"overflow" : "hidden",
		"overflow-y" : "auto"
	},

	"#SFChat sfp":
	{
		"display" : "block",
		"line-height" : "20px",
		"padding" : "6px 10px",
		"font-size" : "14px"
 	},

	"#SFChat sfp.wrapper-SFfriendSay" :
	{
		"background" : "#eeeeee"
	},

	"sfp sfspan.SFSayText" :
	{
		"margin"  : "0 0 0 0"
	},

	"sfp sfdiv":
	{
		"padding" : "0 0 0 30px",
		"display" : "block"
	},

	"sfp sfspan.SFfriendSay, sfp sfspan.SFmeSay":
	{
		"font-weight" : "bold"
	}


};

})(window);