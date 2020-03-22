// Sic Bo
var Game =
{
    Balance                         : 1000000,
    Button                          : false,
    CaptureStart                    : { X : -1, Y : -1 },
    Deck                            : [1, 2, 3, 4, 5, 6],
    Denom                           : 0,
    DenomAmount                     : [100, 500, 2500, 10000],
    DenomPosition                   : [130, 191, 252, 313],
    HotSpot                         : [],
    IsCapturing                     : false,
    IsHovering                      : false,
    LastWin                         : 0,
    Point                           : 0,
    SlowMo                          : false,
    Sum                             : 0,
    Wager                           : [],

    GetEventInfo                    : function(e) { var o = Obj("capture"); var x = 0; var y = 0; var a = e.altKey; var c = e.ctrlKey; var s = e.shiftKey; if (e.offsetX || e.offsetY) { x = e.offsetX; y = e.offsetY; } else { while (o) { x += o.offsetLeft; y += o.offsetTop; o = o.offsetParent; } x = e.pageX - x; y = e.pageY - y; } return { X : x, Y : y, Alt : a, Ctrl : c, Shift : s, Button : Game.Button }; },
    GlobalMouseDown                 : function(e) { Game.Button = true; },
    GlobalMouseUp                   : function(e) { Game.Button = false; Game.IsCapturing = false; for (var h in Game.HotSpot) { Game.HotSpot[h].IsCapturing = false; } },
    KeyReleased                     : function(e) { if (Game.HotSpot["ButtonMsgBox"].Enabled == false) { return true; } if ((e.keyCode == 13) || (e.keyCode == 27) || (e.keyCode == 32)) { Game.HotSpot["ButtonMsgBox"].Click(); return false; } return true; },
    MouseClick                      : function(e) { var evt = Game.GetEventInfo(e ? e : window.event); for (var h in Game.HotSpot) { if (Game.HotSpot[h].Enabled && Game.HotSpot[h].Contains(evt.X, evt.Y) && Game.HotSpot[h].Contains(Game.CaptureStart.X, Game.CaptureStart.Y)) { Game.IsCapturing = false; Game.IsHovering = true; Game.HotSpot[h].IsCapturing = false; Game.HotSpot[h].IsHovering = true; Game.HotSpot[h].Click(evt.Alt, evt.Ctrl, evt.Shift); } } },
    MouseDoubleClick                : function(e) { var evt = Game.GetEventInfo(e ? e : window.event); for (var h in Game.HotSpot) { if (Game.HotSpot[h].Enabled && Game.HotSpot[h].Contains(evt.X, evt.Y) && Game.HotSpot[h].Contains(Game.CaptureStart.X, Game.CaptureStart.Y)) { Game.IsCapturing = false; Game.IsHovering = true; Game.HotSpot[h].IsCapturing = false; Game.HotSpot[h].IsHovering = true; Game.HotSpot[h].DoubleClick(evt.Alt, evt.Ctrl, evt.Shift); } } },
    MouseDown                       : function(e) { var evt = Game.GetEventInfo(e ? e : window.event); Game.CaptureStart.X = evt.X; Game.CaptureStart.Y = evt.Y; for (var h in Game.HotSpot) { if (Game.HotSpot[h].Enabled && Game.HotSpot[h].Contains(evt.X, evt.Y)) { Game.IsCapturing = true; Game.HotSpot[h].IsCapturing = true; Game.HotSpot[h].Down(evt.Alt, evt.Ctrl, evt.Shift); } } },
    MouseMove                       : function(e) { var evt = Game.GetEventInfo(e ? e : window.event); var NewCap = false; var NewHov = false; for (var h in Game.HotSpot) { if (Game.HotSpot[h].Enabled) { if (Game.IsCapturing && Game.Button) { if (Game.HotSpot[h].Contains(evt.X, evt.Y)) { if (Game.HotSpot[h].IsCapturing) { if (!Game.HotSpot[h].IsHovering) { Game.HotSpot[h].IsHovering = true; Game.HotSpot[h].Down(evt.Alt, evt.Ctrl, evt.Shift); } } else { if (Game.HotSpot[h].IsHovering) { Game.HotSpot[h].IsHovering = false; Game.HotSpot[h].Leave(evt.Alt, evt.Ctrl, evt.Shift); } } } else { if (Game.HotSpot[h].IsHovering) { Game.HotSpot[h].IsHovering = false; Game.HotSpot[h].Leave(evt.Alt, evt.Ctrl, evt.Shift); } } } else { if (Game.HotSpot[h].Contains(evt.X, evt.Y)) { if (!Game.HotSpot[h].IsHovering) { Game.HotSpot[h].IsHovering = true; Game.HotSpot[h].Hover(evt.Alt, evt.Ctrl, evt.Shift); } } else { if (Game.HotSpot[h].IsHovering) { Game.HotSpot[h].IsHovering = false; Game.HotSpot[h].Leave(evt.Alt, evt.Ctrl, evt.Shift); } } } } else { if (Game.HotSpot[h].IsCapturing || Game.HotSpot[h].IsHovering) { Game.HotSpot[h].IsCapturing = false; Game.HotSpot[h].IsHovering = false; Game.HotSpot[h].Leave(); } } NewCap |= Game.HotSpot[h].IsCapturing; NewHov |= Game.HotSpot[h].IsHovering; } Game.IsCapturing = NewCap; Game.IsHovering = NewHov; },
    MouseOut                        : function(e) { Game.IsHovering = false; for (var h in Game.HotSpot) { if (Game.HotSpot[h].IsHovering) { Game.HotSpot[h].IsHovering = false; Game.HotSpot[h].Leave(); } } },
    MouseUp                         : function(e) { var evt = Game.GetEventInfo(e ? e : window.event); for (var h in Game.HotSpot) { Game.IsCapturing = false; Game.HotSpot[h].IsCapturing = false; if (Game.HotSpot[h].Enabled && Game.HotSpot[h].Contains(evt.X, evt.Y)) { Game.HotSpot[h].IsHovering = true; if (Game.HotSpot[h].IsCapturing) { Game.HotSpot[h].Up(evt.Alt, evt.Ctrl, evt.Shift); } else { Game.HotSpot[h].Hover(evt.Alt, evt.Ctrl, evt.Shift); } } else { Game.HotSpot[h].IsHovering = false; } } },
    DisableInput                    : function() { for (var h in Game.HotSpot) { try { Game.HotSpot[h].Disable(); } catch (e) { } } },

    ////////////////////////////////////////////////////////////////////////////////
    //
    // INITIALIZE
    //
    ////////////////////////////////////////////////////////////////////////////////

    Initialize : function()
    {
        // Single ou OneOfKind 1:1 1:2 1:12
        Game.HotSpot.OneOfKind1      = new WagerHotSpot(Shape.Rectangle,  [13,640, 257,119],    "OneOfKind1");
        Game.HotSpot.OneOfKind2      = new WagerHotSpot(Shape.Rectangle,  [305,89, 348,119],    "OneOfKind2");
        Game.HotSpot.OneOfKind3      = new WagerHotSpot(Shape.Rectangle,  [396,89, 439,119],    "OneOfKind3");
        Game.HotSpot.OneOfKind4      = new WagerHotSpot(Shape.Rectangle,  [487,89, 530,119],    "OneOfKind4");
        Game.HotSpot.OneOfKind5      = new WagerHotSpot(Shape.Rectangle,  [578,89, 621,119],    "OneOfKind5");
        Game.HotSpot.OneOfKind6      = new WagerHotSpot(Shape.Rectangle,  [669,89, 712,119],    "OneOfKind6");
        // 1:10 
        Game.HotSpot.TwoOfKindOne    = new WagerHotSpot(Shape.Rectangle,  [192,250, 232,356],    "TwoOfKindOne");
        Game.HotSpot.TwoOfKindTwo    = new WagerHotSpot(Shape.Rectangle,  [262,252, 303,358],    "TwoOfKindTwo");
        Game.HotSpot.TwoOfKindThree  = new WagerHotSpot(Shape.Rectangle,  [329,250, 370,259],    "TwoOfKindThree");
        Game.HotSpot.TwoOfKindFour   = new WagerHotSpot(Shape.Rectangle,  [816,253, 856,356],    "TwoOfKindFour");
        Game.HotSpot.TwoOfKindFive   = new WagerHotSpot(Shape.Rectangle,  [885,251, 924,358],    "TwoOfKindFive");
        Game.HotSpot.TwoOfKindSix    = new WagerHotSpot(Shape.Rectangle,  [953,253, 991,357],    "TwoOfKindSix");
        // 1:180
        Game.HotSpot.ThreeOfKindOne  = new WagerHotSpot(Shape.Rectangle,  [396,237, 498,264],    "ThreeOfKindOne");
        Game.HotSpot.ThreeOfKindTwo  = new WagerHotSpot(Shape.Rectangle,  [398,289, 499,317],    "ThreeOfKindTwo");
        Game.HotSpot.ThreeOfKindThree= new WagerHotSpot(Shape.Rectangle,  [395,344, 498,372],    "ThreeOfKindThree");
        Game.HotSpot.ThreeOfKindFour = new WagerHotSpot(Shape.Rectangle,  [686,236, 790,266],    "ThreeOfKindFour");
        Game.HotSpot.ThreeOfKindFive = new WagerHotSpot(Shape.Rectangle,  [689,292, 789,315],    "ThreeOfKindFive");
        Game.HotSpot.ThreeOfKindSix  = new WagerHotSpot(Shape.Rectangle,  [688,342, 789,370],    "ThreeOfKindSix");
        // 1:1
        Game.HotSpot.Low             = new WagerHotSpot(Shape.Rectangle,  [22,189, 172,381],     "Low");
        Game.HotSpot.High            = new WagerHotSpot(Shape.Rectangle,  [1010,193, 1162,370],  "High");
        // 1:30
        Game.HotSpot.AllThree        = new WagerHotSpot(Shape.Rectangle,  [509,225, 672,380],    "AllThree");
        // Total ou Sum 1:vary
        Game.HotSpot.Sum4            = new WagerHotSpot(Shape.Rectangle,  [13,386, 90,480],      "Sum4");
        Game.HotSpot.Sum5            = new WagerHotSpot(Shape.Rectangle,  [94,386, 175,480],     "Sum5");
        Game.HotSpot.Sum6            = new WagerHotSpot(Shape.Rectangle,  [178,386, 260,480],    "Sum6");
        Game.HotSpot.Sum7            = new WagerHotSpot(Shape.Rectangle,  [262,386, 340,480],    "Sum7");
        Game.HotSpot.Sum8            = new WagerHotSpot(Shape.Rectangle,  [343,386, 420,480],    "Sum8");
        Game.HotSpot.Sum9            = new WagerHotSpot(Shape.Rectangle,  [423,386, 505,480],    "Sum9");
        Game.HotSpot.Sum10           = new WagerHotSpot(Shape.Rectangle,  [513,386, 590,480],    "Sum10");
        Game.HotSpot.Sum11           = new WagerHotSpot(Shape.Rectangle,  [593,386, 675,480],    "Sum11");
        Game.HotSpot.Sum12           = new WagerHotSpot(Shape.Rectangle,  [673,386, 755,480],    "Sum12");
        Game.HotSpot.Sum13           = new WagerHotSpot(Shape.Rectangle,  [759,386, 840,480],    "Sum13");
        Game.HotSpot.Sum14           = new WagerHotSpot(Shape.Rectangle,  [845,386, 921,480],    "Sum14");
        Game.HotSpot.Sum15           = new WagerHotSpot(Shape.Rectangle,  [927,386, 1005,480],   "Sum15");
        Game.HotSpot.Sum16           = new WagerHotSpot(Shape.Rectangle,  [1010,386, 1088,480],  "Sum16");
        Game.HotSpot.Sum17           = new WagerHotSpot(Shape.Rectangle,  [1093,386, 1175,480],  "Sum17");
        // 1:5 
        Game.HotSpot.Duo12           = new WagerHotSpot(Shape.Rectangle,  [208,483, 266,631],    "Duo12");
        Game.HotSpot.Duo13           = new WagerHotSpot(Shape.Rectangle,  [275,483, 329,631],    "Duo13");
        Game.HotSpot.Duo14           = new WagerHotSpot(Shape.Rectangle,  [336,483, 398,631],    "Duo14");
        Game.HotSpot.Duo15           = new WagerHotSpot(Shape.Rectangle,  [402,483, 459,631],    "Duo15");
        Game.HotSpot.Duo16           = new WagerHotSpot(Shape.Rectangle,  [466,483, 525,631],    "Duo16");
        Game.HotSpot.Duo23           = new WagerHotSpot(Shape.Rectangle,  [532,483, 588,631],    "Duo23");
        Game.HotSpot.Duo24           = new WagerHotSpot(Shape.Rectangle,  [597,483, 654,631],    "Duo24");
        Game.HotSpot.Duo25           = new WagerHotSpot(Shape.Rectangle,  [662,483, 720,631],    "Duo25");
        Game.HotSpot.Duo26           = new WagerHotSpot(Shape.Rectangle,  [727,483, 784,631],    "Duo26");
        Game.HotSpot.Duo34           = new WagerHotSpot(Shape.Rectangle,  [791,483, 848,631],    "Duo34");
        Game.HotSpot.Duo35           = new WagerHotSpot(Shape.Rectangle,  [857,483, 912,631],    "Duo35");
        Game.HotSpot.Duo36           = new WagerHotSpot(Shape.Rectangle,  [920,483, 976,631],    "Duo36");
        Game.HotSpot.Duo45           = new WagerHotSpot(Shape.Rectangle,  [984,483, 1043,631],   "Duo45");
        Game.HotSpot.Duo46           = new WagerHotSpot(Shape.Rectangle,  [1050,483, 1107,631],  "Duo46");
        Game.HotSpot.Duo56           = new WagerHotSpot(Shape.Rectangle,  [1117,483, 1169,631],  "Duo56");
        // // //
        Game.HotSpot.Denom0          = new HotSpot(Shape.Ellipse,    [206, 787, 304, 875], null, null, null, null, function(a, c, s) { Game.SetDenom(0); }, null),
        Game.HotSpot.Denom1          = new HotSpot(Shape.Ellipse,    [267, 787, 365, 875], null, null, null, null, function(a, c, s) { Game.SetDenom(1); }, null),
        Game.HotSpot.Denom2          = new HotSpot(Shape.Ellipse,    [328, 787, 426, 875], null, null, null, null, function(a, c, s) { Game.SetDenom(2); }, null),
        Game.HotSpot.Denom3          = new HotSpot(Shape.Ellipse,    [389, 787, 487, 875], null, null, null, null, function(a, c, s) { Game.SetDenom(3); }, null),

        Game.HotSpot.ButtonRoll      = new ButtonHotSpot(Shape.Rectangle,   [670, 797, 908, 873], "btn_roll",      120, 50, 0, function(a, c, s) { Game.Roll(a, c, s); }),
        Game.HotSpot.ButtonClear     = new ButtonHotSpot(Shape.Rectangle,   [800, 797, 1038, 873], "btn_clear",     120, 50, 1, function(a, c, s) { Game.Clear(); }),

        // Boh
        Game.HotSpot.ButtonMsgBox    = new ButtonHotSpot(Shape.Rectangle,   [340, 340, 459, 389], "msgbox_button", 120, 50, 2, function(a, c, s) { MessageBox.Hide(); })

        Game.Wager.OneOfKind1        = new Wager("OneOfKind1",         108, 675, 0, 500000, "OneOfKind1");
        Game.Wager.OneOfKind2        = new Wager("OneOfKind2",         290, 675, 0, 500000, "OneOfKind2");
        Game.Wager.OneOfKind3        = new Wager("OneOfKind3",         480, 675, 0, 500000, "OneOfKind3");
        Game.Wager.OneOfKind4        = new Wager("OneOfKind4",         675, 675, 0, 500000, "OneOfKind4");
        Game.Wager.OneOfKind5        = new Wager("OneOfKind5",         848, 675, 0, 500000, "OneOfKind5");
        Game.Wager.OneOfKind6        = new Wager("OneOfKind6",         1048, 675, 0, 500000, "OneOfKind6");

        Game.Wager.TwoOfKindOne      = new Wager("TwoOfKindOne",       210,  300, 0, 500000, "TwoOfKindOne");
        Game.Wager.TwoOfKindTwo      = new Wager("TwoOfKindTwo",       280,  300, 0, 500000, "TwoOfKindTwo");
        Game.Wager.TwoOfKindThree    = new Wager("TwoOfKindThree",     355,  300, 0, 500000, "TwoOfKindThree");
        Game.Wager.TwoOfKindFour     = new Wager("TwoOfKindFour",      838,  303, 0, 500000, "TwoOfKindFour");
        Game.Wager.TwoOfKindFive     = new Wager("TwoOfKindFive",      908,  303, 0, 500000, "TwoOfKindFive");
        Game.Wager.TwoOfKindSix      = new Wager("TwoOfKindSix",       974,  303, 0, 500000, "TwoOfKindSix");

        Game.Wager.ThreeOfKindOne    = new Wager("ThreeOfKindOne",     448,  252, 0, 500000, "ThreeOfKindOne");
        Game.Wager.ThreeOfKindTwo    = new Wager("ThreeOfKindTwo",     448,  305, 0, 500000, "ThreeOfKindTwo");
        Game.Wager.ThreeOfKindThree  = new Wager("ThreeOfKindThree",   448,  355, 0, 500000, "ThreeOfKindThree");
        Game.Wager.ThreeOfKindFour   = new Wager("ThreeOfKindFour",    740,  252, 0, 500000, "ThreeOfKindFour");
        Game.Wager.ThreeOfKindFive   = new Wager("ThreeOfKindFive",    740,  305, 0, 500000, "ThreeOfKindFive");
        Game.Wager.ThreeOfKindSix    = new Wager("ThreeOfKindSix",     740,  355, 0, 500000, "ThreeOfKindSix");
        // 1:1
        Game.Wager.Low         = new Wager("Low",      90, 270, 0, 500000, "Low");
        Game.Wager.High        = new Wager("High",     1090, 270, 0, 500000, "High");
        // 1:30
        Game.Wager.AllThree    = new Wager("AllThree", 595, 260, 0, 500000, "AllThree");

        Game.Wager.Sum4        = new Wager("Sum4",     55, 430, 0, 500000, "Sum4");
        Game.Wager.Sum5        = new Wager("Sum5",     140, 430, 0, 500000, "Sum5");
        Game.Wager.Sum6        = new Wager("Sum6",     225, 430, 0, 500000, "Sum6");
        Game.Wager.Sum7        = new Wager("Sum7",     306, 430, 0, 500000, "Sum7");
        Game.Wager.Sum8        = new Wager("Sum8",     382, 430, 0, 500000, "Sum8");
        Game.Wager.Sum9        = new Wager("Sum9",     470, 430, 0, 500000, "Sum9");
        Game.Wager.Sum10       = new Wager("Sum10",    550, 430, 0, 500000, "Sum10");
        Game.Wager.Sum11       = new Wager("Sum11",    640, 430, 0, 500000, "Sum11");
        Game.Wager.Sum12       = new Wager("Sum12",    720, 430, 0, 500000, "Sum12");
        Game.Wager.Sum13       = new Wager("Sum13",    810, 430, 0, 500000, "Sum13");
        Game.Wager.Sum14       = new Wager("Sum14",    880, 430, 0, 500000, "Sum14");
        Game.Wager.Sum15       = new Wager("Sum15",    970, 430, 0, 500000, "Sum15");
        Game.Wager.Sum16       = new Wager("Sum16",    1050, 430, 0, 500000, "Sum16");
        Game.Wager.Sum17       = new Wager("Sum17",    1140, 430, 0, 500000, "Sum17");

        Game.Wager.Duo12       = new Wager("Duo12",    240, 560, 0, 500000, "Duo12");
        Game.Wager.Duo13       = new Wager("Duo13",    300, 560, 0, 500000, "Duo13");
        Game.Wager.Duo14       = new Wager("Duo14",    370, 560, 0, 500000, "Duo14");
        Game.Wager.Duo15       = new Wager("Duo15",    430, 560, 0, 500000, "Duo15");
        Game.Wager.Duo16       = new Wager("Duo16",    500, 560, 0, 500000, "Duo16");
        Game.Wager.Duo23       = new Wager("Duo23",    565, 560, 0, 500000, "Duo23");
        Game.Wager.Duo24       = new Wager("Duo24",    630, 560, 0, 500000, "Duo24");
        Game.Wager.Duo25       = new Wager("Duo25",    670, 560, 0, 500000, "Duo25");
        Game.Wager.Duo26       = new Wager("Duo26",    755, 560, 0, 500000, "Duo26");
        Game.Wager.Duo34       = new Wager("Duo34",    820, 560, 0, 500000, "Duo34");
        Game.Wager.Duo35       = new Wager("Duo35",    888, 560, 0, 500000, "Duo35");
        Game.Wager.Duo36       = new Wager("Duo36",    950, 560, 0, 500000, "Duo36");
        Game.Wager.Duo45       = new Wager("Duo45",    1015, 560, 0, 500000, "Duo45");
        Game.Wager.Duo46       = new Wager("Duo46",    1080, 560, 0, 500000, "Duo46");
        Game.Wager.Duo56       = new Wager("Duo56",    1140, 560, 0, 500000, "Duo56");

        // // //
        var cap = Obj("capture");

        cap.onselectstart               = function() { return false; };
        cap.ondragstart                 = function() { return false; };
        cap.onmousemove                 = Game.MouseMove;
        cap.onmousedown                 = Game.MouseDown;
        cap.onmouseup                   = Game.MouseUp;
        cap.onclick                     = Game.MouseClick;
        cap.ondblclick                  = Game.MouseDoubleClick;
        cap.onmouseout                  = Game.MouseOut;
        document.body.onmousedown       = Game.GlobalMouseDown;
        document.body.onmouseup         = Game.GlobalMouseUp;
        document.onkeydown              = function(e) { return Game.KeyReleased(e || window.event); }

        Obj("loading").Hide();
        Obj("game").Show();
        Obj("game").scrollIntoView();

        Game.Update();
    },

    ////////////////////////////////////////////////////////////////////////////////
    //
    // UPDATE
    //
    ////////////////////////////////////////////////////////////////////////////////

    Update : function()
    {
        var betson = Obj("BetsOn").checked;

        // Update Balance

        Obj("balance").innerHTML = Font.Write(Color.Yellow, Font.Format(Game.Balance));

        // Update Wagers
        Game.Wager.OneOfKind2.Adjustable      = true;
        Game.Wager.OneOfKind1.Adjustable      = true;
        Game.Wager.OneOfKind3.Adjustable      = true;
        Game.Wager.OneOfKind4.Adjustable      = true;
        Game.Wager.OneOfKind5.Adjustable      = true;
        Game.Wager.OneOfKind6.Adjustable      = true;

        Game.Wager.TwoOfKindOne.Adjustable    = true;
        Game.Wager.TwoOfKindTwo.Adjustable    = true;
        Game.Wager.TwoOfKindThree.Adjustable  = true;
        Game.Wager.TwoOfKindFour.Adjustable   = true;
        Game.Wager.TwoOfKindFive.Adjustable   = true;
        Game.Wager.TwoOfKindSix.Adjustable    = true;

        Game.Wager.ThreeOfKindOne.Adjustable  = true;
        Game.Wager.ThreeOfKindTwo.Adjustable  = true;
        Game.Wager.ThreeOfKindThree.Adjustable= true;
        Game.Wager.ThreeOfKindFour.Adjustable = true;
        Game.Wager.ThreeOfKindFive.Adjustable = true;
        Game.Wager.ThreeOfKindSix.Adjustable  = true;

        Game.Wager.Low.Adjustable             = true;
        Game.Wager.High.Adjustable            = true;
        Game.Wager.AllThree.Adjustable        = true;

        Game.Wager.Sum4.Adjustable            = true;
        Game.Wager.Sum5.Adjustable            = true;
        Game.Wager.Sum6.Adjustable            = true;
        Game.Wager.Sum7.Adjustable            = true;
        Game.Wager.Sum8.Adjustable            = true;
        Game.Wager.Sum9.Adjustable            = true;
        Game.Wager.Sum10.Adjustable           = true;
        Game.Wager.Sum11.Adjustable           = true;
        Game.Wager.Sum12.Adjustable           = true;
        Game.Wager.Sum13.Adjustable           = true;
        Game.Wager.Sum14.Adjustable           = true;
        Game.Wager.Sum15.Adjustable           = true;
        Game.Wager.Sum16.Adjustable           = true;
        Game.Wager.Sum17.Adjustable           = true;

        Game.Wager.Duo12.Adjustable           = true;
        Game.Wager.Duo13.Adjustable           = true;
        Game.Wager.Duo14.Adjustable           = true;
        Game.Wager.Duo15.Adjustable           = true;
        Game.Wager.Duo16.Adjustable           = true;
        Game.Wager.Duo23.Adjustable           = true;
        Game.Wager.Duo24.Adjustable           = true;
        Game.Wager.Duo25.Adjustable           = true;
        Game.Wager.Duo26.Adjustable           = true;
        Game.Wager.Duo34.Adjustable           = true;
        Game.Wager.Duo35.Adjustable           = true;
        Game.Wager.Duo36.Adjustable           = true;
        Game.Wager.Duo45.Adjustable           = true;
        Game.Wager.Duo46.Adjustable           = true;
        Game.Wager.Duo56.Adjustable           = true;

        // Update Total Bet

        var total_bet = 0;
        var total_adj = 0;

        for (var k in Game.Wager)
        {
            total_bet += Game.Wager[k].Amount;
            total_adj += (Game.Wager[k].Adjustable ? Game.Wager[k].Amount : 0);
        }

        Obj("wager").innerHTML = Font.Write(Color.Yellow, Font.Format(total_bet));

        // Enable Wagers

        for (var k in Game.Wager)
        {
            Game.HotSpot[k].Enable();
        }

        // Update Buttons

        Game.HotSpot["Denom0"].Enable();
        Game.HotSpot["Denom1"].Enable();
        Game.HotSpot["Denom2"].Enable();
        Game.HotSpot["Denom3"].Enable();

        Game.HotSpot["ButtonRoll"].Enable();
        Game.HotSpot["ButtonClear"].EnableIf(total_adj > 0);
    },

    ////////////////////////////////////////////////////////////////////////////////
    //
    // SET DENOMINATION
    //
    ////////////////////////////////////////////////////////////////////////////////

    SetDenom : function(n)
    {
        var obj = Obj("denom");

        Game.Denom = n;
        obj.style.left = Game.DenomPosition[n] + "px";
        obj.Show();
    },

    ////////////////////////////////////////////////////////////////////////////////
    //
    // CLEAR
    //
    ////////////////////////////////////////////////////////////////////////////////

    Clear : function()
    {
        var a = [];

        a.push("OneOfKind2");
        a.push("OneOfKind1");
        a.push("OneOfKind3");
        a.push("OneOfKind4");
        a.push("OneOfKind5");
        a.push("OneOfKind6");
        a.push("TwoOfKindOne");
        a.push("TwoOfKindTwo");
        a.push("TwoOfKindThree");
        a.push("TwoOfKindFour");
        a.push("TwoOfKindFive");
        a.push("TwoOfKindSix");
        a.push("ThreeOfKindOne");
        a.push("ThreeOfKindTwo");
        a.push("ThreeOfKindThree");
        a.push("ThreeOfKindFour");
        a.push("ThreeOfKindFive");
        a.push("ThreeOfKindSix");
        a.push("Low");
        a.push("High");
        a.push("AllThree");
        a.push("Sum4");
        a.push("Sum5");
        a.push("Sum6");
        a.push("Sum7");
        a.push("Sum8");
        a.push("Sum9");
        a.push("Sum10");
        a.push("Sum11");
        a.push("Sum12");
        a.push("Sum13");
        a.push("Sum14");
        a.push("Sum15");
        a.push("Sum16");
        a.push("Sum17");
        a.push("Duo12");
        a.push("Duo13");
        a.push("Duo14");
        a.push("Duo15");
        a.push("Duo16");
        a.push("Duo23");
        a.push("Duo24");
        a.push("Duo25");
        a.push("Duo26");
        a.push("Duo34");
        a.push("Duo35");
        a.push("Duo36");
        a.push("Duo45");
        a.push("Duo46");
        a.push("Duo56");


        for (var x = 0; x < a.length; x++)
        {
            Game.Wager[a[x]].Clear();
        }

        Game.Update();
    },

    ////////////////////////////////////////////////////////////////////////////////
    //
    // ROLL
    //
    ////////////////////////////////////////////////////////////////////////////////

    Roll : function(a, c, s)
    {
        Game.DisableInput();

        Game.SlowMo = c && s;

        var betson = Obj("BetsOn").checked;

        Obj("win").innerHTML = "";
        Game.LastWin = 0;

        var die1 = RNG.Next(6) + 1; Game.die1 = die1;
        var die2 = RNG.Next(6) + 1; Game.die2 = die2;
        var die3 = RNG.Next(6) + 1; Game.die3 = die3;

        var sum  = die1 + die2 + die3; Game.Sum = sum;

        var d = [die1, die2, die3];
        d.sort();
        // animate dice roll

        var delay = 0;
        var dummy = 0;

        var d1 = Obj("die1");
        var d2 = Obj("die2");
        var d3 = Obj("die3");

        d1.MoveTo(800, 158);
        d2.MoveTo(800, 203);
        d3.MoveTo(800, 248);

        var dur1 = 400;
        var dur2 = 400;
        var dur3 = 400;
        var dur4 = 80;
        var frms = (dur1 + dur2 + dur3) / dur4;

        for (var x = 0; x < frms; x++)
        {
            setTimeout
            (
                function()
                {
                    d1.style.backgroundPosition = "0 " + (Math.floor(Math.random() * 6) * -45) + "px";
                    d2.style.backgroundPosition = "0 " + (Math.floor(Math.random() * 6) * -45) + "px";
                    d3.style.backgroundPosition = "0 " + (Math.floor(Math.random() * 6) * -45) + "px";
                },

                delay + (x * dur4)
            );
        }

        dummy = d1.Slide(800, 158, 0, 142, 100, dur1, delay);
        delay = d2.Slide(800, 203, 0, 219, 100, dur1, delay);
        delay = d3.Slide(800, 248, 0, 296, 100, dur1, delay);
        dummy = d1.Slide(0, 142, 128 + Math.floor(Math.random() * 60), 148 + Math.floor(Math.random() * 10), 100, dur2, delay);
        delay = d2.Slide(0, 219, 128 + Math.floor(Math.random() * 60), 203 + Math.floor(Math.random() * 10), 100, dur2, delay);
        delay = d3.Slide(0, 248, 128 + Math.floor(Math.random() * 60), 258 + Math.floor(Math.random() * 10), 100, dur2, delay);

        setTimeout
        (
            function()
            {
                d1.style.backgroundPosition = "0 " + ((die1 - 1) * -45) + "px";
                d2.style.backgroundPosition = "0 " + ((die2 - 1) * -45) + "px";
                d3.style.backgroundPosition = "0 " + ((die3 - 1) * -45) + "px";                
            },

            delay
        );

       

        // Primary Bets
        // 3 = 1 + 1 + 1
        // 4 = 1 + 1 + 2
        // 5 = 1 + 1 + 3 = 2 + 2 + 1
        // 6 = 1 + 1 + 4 = 1 + 2 + 3 = 2 + 2 + 2
        // 7 = 1 + 1 + 5 = 2 + 2 + 3 = 3 + 3 + 1 = 1 + 2 + 4
        // 8 = 1 + 1 + 6 = 2 + 3 + 3 = 4 + 3 + 1 = 1 + 2 + 5 = 2 + 2 + 4
        // 9 = 6 + 2 + 1 = 4 + 3 + 2 = 3 + 3 + 3 = 2 + 2 + 5 = 1 + 3 + 5 = 1 + 4 + 4
        // 10 = 6 + 3 + 1 = 6 + 2 + 2 = 5 + 3 + 2 = 4 + 4 + 2 = 4 + 3 + 3 = 1 + 4 + 5

        // 11 = 6 + 4 + 1 = 1 + 5 + 5 = 5 + 4 + 2 = 3 + 3 + 5 = 4 + 3 + 4 = 6 + 3 + 2
        // 12 = 6 + 5 + 1 = 4 + 3 + 5 = 4 + 4 + 4 = 5 + 2 + 5 = 6 + 4 + 2 = 6 + 3 + 3
        // 13 = 6 + 6 + 1 = 5 + 4 + 4 = 3 + 4 + 6 = 6 + 5 + 2 = 5 + 5 + 3
        // 14 = 6 + 6 + 2 = 5 + 5 + 4 = 4 + 4 + 6 = 6 + 5 + 3
        // 15 = 6 + 6 + 3 = 6 + 5 + 4 = 5 + 5 + 5
        // 16 = 6 + 6 + 4 = 5 + 5 + 6
        // 17 = 6 + 6 + 5
        // 18 = 6 + 6 + 6
        switch (sum)
        {
            // 3 = 1 + 1 + 1
            case 3:
            {
                if (Game.Wager.AllThree.Amount > 0) {delay = Game.Wager.AllThree.Win(30, delay)}
                if (Game.Wager.Low.Amount > 0) {delay = Game.Wager.Low.Amount.Lose(delay)}
                if (Game.Wager.ThreeOfKindOne.Amount > 0 && (die1 === die2 === die3)) {delay = Game.Wager.ThreeOfKindOne.Win(180, delay)}
                if (Game.Wager.OneOfKind1 > 0 && (die1 === die2 === die3)) {delay = Game.Wager.OneOfKind1.Win(12, delay)}
                break;
            }
            // 4 = 1 + 1 + 2
            case 4:
            {
                if (Game.Wager.Sum4.Amount > 0) {delay = Game.Wager.Sum4.Win(60, delay)}
                if (Game.Wager.Low.Amount > 0) {delay = Game.Wager.Low.Amount.Win(1, delay)}

                if (Game.Wager.OneOfKind1 > 0) {delay = Game.Wager.OneOfKind1.Win(2, delay)}
                if (Game.Wager.TwoOfKindOne > 0) {delay = Game.Wager.TwoOfKindOne.Win(10, delay)}
                if (Game.Wager.Duo12.Amount > 0) {delay = Game.Wager.Duo12.Win(5, delay)}

                break;
            }
            // 5 = 1 + 1 + 3 = 2 + 2 + 1
            case 5:
            {
                if (Game.Wager.Sum5.Amount > 0) {delay = Game.Wager.Sum5.Win(30 ,delay)}

                if (Game.Wager.Low.Amount > 0) {delay = Game.Wager.Low.Amount.Win(1, delay)}

                if (Game.Wager.OneOfKind1 > 0 && (d.isArray(3))) 
                {
                    delay = Game.Wager.OneOfKind1.Win(2, delay)
                }
                else
                {
                    delay = Game.Wager.OneOfKind1.Win(1, delay)
                }
                if (Game.Wager.TwoOfKindOne > 0 && (d.isArray(3))) {delay = Game.Wager.TwoOfKindTwo.Win(10, delay)}
                if (Game.Wager.TwoOfKindTwo > 0 && (d.isArray(2))) {delay = Game.Wager.TwoOfKindTwo.Win(10, delay)}

                if (Game.Wager.Duo12.Amount > 0 && (d.isArray(2))) {delay = Game.Wager.Duo12.Win(5, delay)}
                if (Game.Wager.Duo13.Amount > 0 && (d.isArray(3))) {delay = Game.Wager.Duo12.Win(5, delay)}
                break;
            }
            // 6 = 1 + 1 + 4 = 1 + 2 + 3 = 2 + 2 + 2
            case 6:
            {
                if (Game.Wager.Sum6.Amount > 0) {delay = Game.Wager.Sum5.Win(18 ,delay)}

                if (die1 === die2 === die3) {delay = Game.Wager.Low.Lose(delay)}else{delay = Game.Wager.Low.Win(1, delay)}
                if (Game.Wager.ThreeOfKindTwo.Amount > 0 && (die1 === die2 === die3)) {delay = Game.Wager.ThreeOfKindTwo.Win(180, delay)}

                if (Game.Wager.OneOfKind1 > 0 && (d.isArray(4))) {delay = Game.Wager.OneOfKind1.Win(2, delay)}
                if (Game.Wager.OneOfKind1 > 0 && (d.isArray(3))) {delay = Game.Wager.OneOfKind1.Win(1, delay)}
                if (Game.Wager.OneOfKind2 > 0 && (d.isArray(3))) {delay = Game.Wager.OneOfKind2.Win(1, delay)}
                if (Game.Wager.OneOfKind2 > 0 && (die1 === die2 === die3)) {delay = Game.Wager.OneOfKind2.Win(12, delay)}
                if (Game.Wager.OneOfKind3 > 0 && (d.isArray(3))) {delay = Game.Wager.OneOfKind3.Win(1, delay)}
                if (Game.Wager.OneOfKind4 > 0 && (d.isArray(4))) {delay = Game.Wager.OneOfKind4.Win(1, delay)}

                if (Game.Wager.TwoOfKindOne > 0 && (d.isArray(4))) {delay = Game.Wager.TwoOfKindOne.Win(10, delay)}
                if (Game.Wager.TwoOfKindTwo > 0 && (die1 === die2 === die3)) {delay = Game.Wager.TwoOfKindTwo.Win(10, delay)}

                if (Game.Wager.Duo12.Amount > 0 && (d.isArray(2))) {delay = Game.Wager.Duo12.Win(5, delay)}
                if (Game.Wager.Duo13.Amount > 0 && (d.isArray(3))) {delay = Game.Wager.Duo12.Win(5, delay)}
                if (Game.Wager.Duo14.Amount > 0 && (d.isArray(4))) {delay = Game.Wager.Duo12.Win(5, delay)}
                if (Game.Wager.Duo23.Amount > 0 && (d.isArray(3))) {delay = Game.Wager.Duo23.Win(5, delay)}                    
                break;
            }
            // 7 = 1 + 1 + 5 = 2 + 2 + 3 = 3 + 3 + 1 = 1 + 2 + 4
            case 7:
            {           
                if (Game.Wager.Sum7.Amount > 0) {delay = Game.Wager.Sum5.Win(12 ,delay)}
                if (Game.Wager.Low.Amount > 0) {delay = Game.Wager.Low.Amount.Win(1, delay)}

                if (Game.Wager.OneOfKind1 > 0 && (d.isArray(3) && (d.isArray(1)))) {delay = Game.Wager.OneOfKind1.Win(1, delay)}
                if (Game.Wager.OneOfKind1 > 0 && (d.isArray(4))) {delay = Game.Wager.OneOfKind1.Win(1, delay)}
                if (Game.Wager.OneOfKind1 > 0 && (d.isArray(5))) {delay = Game.Wager.OneOfKind1.Win(2, delay)}
                if (Game.Wager.OneOfKind1 > 0 && (d.isArray(4))) {delay = Game.Wager.OneOfKind1.Win(2, delay)}
                if (Game.Wager.OneOfKind2 > 0 && (d.isArray(3)) && (d.isArray(2))) {delay = Game.Wager.OneOfKind2.Win(2, delay)}
                if (Game.Wager.OneOfKind2 > 0 && (d.isArray(4))) {delay = Game.Wager.OneOfKind2.Win(1, delay)}
                if (Game.Wager.OneOfKind3 > 0 && (d.isArray(3) && (d.isArray(2)))) {delay = Game.Wager.OneOfKind3.Win(1, delay)}
                if (Game.Wager.OneOfKind3 > 0 && (d.isArray(3) && (d.isArray(1)))) {delay = Game.Wager.OneOfKind3.Win(2, delay)}
                if (Game.Wager.OneOfKind4 > 0 && (d.isArray(4))) {delay = Game.Wager.OneOfKind4.Win(1, delay)}
                if (Game.Wager.OneOfKind5 > 0 && (d.isArray(5))) {delay = Game.Wager.OneOfKind5.Win(1, delay)}

                if (Game.Wager.TwoOfKindOne > 0 && (d.isArray(5))) {delay = Game.Wager.TwoOfKindOne.Win(10, delay)}
                if (Game.Wager.TwoOfKindTwo > 0 && (d.isArray(3) && (d.isArray(2)))) {delay = Game.Wager.TwoOfKindTwo.Win(10, delay)}
                if (Game.Wager.TwoOfKindThree > 0 && (d.isArray(3) && (d.isArray(1)))) {delay = Game.Wager.TwoOfKindThree.Win(10, delay)}

                if (Game.Wager.Duo12.Amount > 0 && (d.isArray(4))) {delay = Game.Wager.Duo12.Win(5, delay)}
                if (Game.Wager.Duo13.Amount > 0 && (d.isArray(3) && (d.isArray(1)))) {delay = Game.Wager.Duo13.Win(5, delay)}
                if (Game.Wager.Duo14.Amount > 0 && (d.isArray(4))) {delay = Game.Wager.Duo14.Win(5, delay)}
                if (Game.Wager.Duo15.Amount > 0 && (d.isArray(4))) {delay = Game.Wager.Duo15.Win(5, delay)}
                if (Game.Wager.Duo23.Amount > 0 && (d.isArray(3) && (d.isArray(2)))) {delay = Game.Wager.Duo23.Win(5, delay)}
                if (Game.Wager.Duo24.Amount > 0 && (d.isArray(4))) {delay = Game.Wager.Duo24.Win(5, delay)}


                break;
            }
            // 8 = 1 + 1 + 6 = 2 + 3 + 3 = 4 + 3 + 1 = 1 + 2 + 5 = 2 + 2 + 4
            case 8:
            {
                if (Game.Wager.Sum8.Amount > 0) {delay = Game.Wager.Sum5.Win(8 ,delay)}
                if (Game.Wager.Low.Amount > 0) {delay = Game.Wager.Low.Amount.Win(1, delay)}

                if (Game.Wager.OneOfKind1 > 0 && (d.isArray(6))) {delay = Game.Wager.OneOfKind1.Win(2, delay)}
                if (Game.Wager.OneOfKind1 > 0 && (d.isArray(5))) {delay = Game.Wager.OneOfKind1.Win(1, delay)}                    
                if (Game.Wager.OneOfKind1 > 0 && (d.isArray(4) && (d.isArray(1)))) {delay = Game.Wager.OneOfKind1.Win(1, delay)}

                if (Game.Wager.OneOfKind2 > 0 && (d.isArray(3) && (d.isArray(2)))) {delay = Game.Wager.OneOfKind2.Win(1, delay)}
                if (Game.Wager.OneOfKind2 > 0 && (d.isArray(5))) {delay = Game.Wager.OneOfKind2.Win(1, delay)}
                if (Game.Wager.OneOfKind2 > 0 && (d.isArray(4) && (d.isArray(2)))) {delay = Game.Wager.OneOfKind2.Win(2, delay)}

                if (Game.Wager.OneOfKind3 > 0 && (d.isArray(3) && (d.isArray(2)))) {delay = Game.Wager.OneOfKind3.Win(2, delay)}
                if (Game.Wager.OneOfKind3 > 0 && (d.isArray(4) && (d.isArray(3)))) {delay = Game.Wager.OneOfKind3.Win(1, delay)}

                if (Game.Wager.OneOfKind4 > 0 && (d.isArray(4) && (d.isArray(3)))) {delay = Game.Wager.OneOfKind4.Win(1, delay)}
                if (Game.Wager.OneOfKind4 > 0 && (d.isArray(4) && (d.isArray(2)))) {delay = Game.Wager.OneOfKind4.Win(1, delay)}

                if (Game.Wager.OneOfKind5 > 0 && (d.isArray(5))) {delay = Game.Wager.OneOfKind5.Win(1, delay)}
                if (Game.Wager.OneOfKind6 > 0 && (d.isArray(6))) {delay = Game.Wager.OneOfKind6.Win(1, delay)}

                if (Game.Wager.TwoOfKindOne > 0 && (d.isArray(6))) {delay = Game.Wager.TwoOfKindOne.Win(10, delay)}
                if (Game.Wager.TwoOfKindTwo > 0 && (d.isArray(4) && (d.isArray(2)))) {delay = Game.Wager.TwoOfKindTwo.Win(10, delay)}
                if (Game.Wager.TwoOfKindThree > 0 && (d.isArray(3) && (d.isArray(2)))) {delay = Game.Wager.TwoOfKindThree.Win(10, delay)}

                if (Game.Wager.Duo12.Amount > 0 && (d.isArray(5))) {delay = Game.Wager.Duo12.Win(5, delay)}
                if (Game.Wager.Duo16.Amount > 0 && (d.isArray(4))) {delay = Game.Wager.Duo16.Win(5, delay)}
                if (Game.Wager.Duo23.Amount > 0 && (d.isArray(3) && (d.isArray(2)))) {delay = Game.Wager.Duo23.Win(5, delay)}
                if (Game.Wager.Duo24.Amount > 0 && (d.isArray(4) && (d.isArray(2)))) {delay = Game.Wager.Duo24.Win(5, delay)}
                if (Game.Wager.Duo25.Amount > 0 && (d.isArray(5))) {delay = Game.Wager.Duo25.Win(5, delay)}
                if (Game.Wager.Duo34.Amount > 0 && (d.isArray(4))) {delay = Game.Wager.Duo34.Win(5, delay)}


                break;
            }
            // 9 = 6 + 2 + 1 = 4 + 3 + 2 = 3 + 3 + 3 = 2 + 2 + 5 = 1 + 3 + 5 = 1 + 4 + 4
            case 9:
            {
                if (Game.Wager.Sum9.Amount > 0) {delay = Game.Wager.Sum5.Win(7 ,delay)}

                if (die1 === die2 === die3) {delay = Game.Wager.Low.Lose(delay)}else{delay = Game.Wager.Low.Win(1, delay)}
                if (Game.Wager.ThreeOfKindThree.Amount > 0 && (die1 === die2 === die3)) {delay = Game.Wager.ThreeOfKindThree.Win(180, delay)}

                if (Game.Wager.OneOfKind1 > 0 && (d.isArray(6))) {delay = Game.Wager.OneOfKind1.Win(2, delay)}
                if (Game.Wager.OneOfKind1 > 0 && (d.isArray(5) && (d.isArray(3)))) {delay = Game.Wager.OneOfKind1.Win(1, delay)}                    
                if (Game.Wager.OneOfKind1 > 0 && (d.isArray(4) && (d.isArray(1)))) {delay = Game.Wager.OneOfKind1.Win(1, delay)}

                if (Game.Wager.OneOfKind2 > 0 && (d.isArray(6) && (d.isArray(2)))) {delay = Game.Wager.OneOfKind2.Win(1, delay)}
                if (Game.Wager.OneOfKind2 > 0 && (d.isArray(5) && (d.isArray(2)))) {delay = Game.Wager.OneOfKind2.Win(2, delay)}
                if (Game.Wager.OneOfKind2 > 0 && (d.isArray(4) && (d.isArray(2)))) {delay = Game.Wager.OneOfKind2.Win(1, delay)}

                if (Game.Wager.OneOfKind3 > 0 && (d.isArray(3) && (d.isArray(2)))) {delay = Game.Wager.OneOfKind3.Win(2, delay)}
                if (Game.Wager.OneOfKind3 > 0 && (d.isArray(4) && (d.isArray(3)))) {delay = Game.Wager.OneOfKind3.Win(1, delay)}

                if (Game.Wager.OneOfKind4 > 0 && (d.isArray(4) && (d.isArray(3)))) {delay = Game.Wager.OneOfKind4.Win(1, delay)}
                if (Game.Wager.OneOfKind4 > 0 && (d.isArray(4) && (d.isArray(2)))) {delay = Game.Wager.OneOfKind4.Win(1, delay)}

                if (Game.Wager.OneOfKind5 > 0 && (d.isArray(5))) {delay = Game.Wager.OneOfKind5.Win(1, delay)}
                if (Game.Wager.OneOfKind6 > 0 && (d.isArray(6))) {delay = Game.Wager.OneOfKind6.Win(1, delay)}

                if (Game.Wager.TwoOfKindOne > 0 && (d.isArray(6))) {delay = Game.Wager.TwoOfKindOne.Win(10, delay)}
                if (Game.Wager.TwoOfKindTwo > 0 && (d.isArray(4) && (d.isArray(2)))) {delay = Game.Wager.TwoOfKindTwo.Win(10, delay)}
                if (Game.Wager.TwoOfKindThree > 0 && (d.isArray(3) && (d.isArray(2)))) {delay = Game.Wager.TwoOfKindThree.Win(10, delay)}

                if (Game.Wager.Duo12.Amount > 0 && (d.isArray(5))) {delay = Game.Wager.Duo12.Win(5, delay)}
                if (Game.Wager.Duo16.Amount > 0 && (d.isArray(4))) {delay = Game.Wager.Duo16.Win(5, delay)}
                if (Game.Wager.Duo23.Amount > 0 && (d.isArray(3) && (d.isArray(2)))) {delay = Game.Wager.Duo23.Win(5, delay)}
                if (Game.Wager.Duo24.Amount > 0 && (d.isArray(4) && (d.isArray(2)))) {delay = Game.Wager.Duo24.Win(5, delay)}
                if (Game.Wager.Duo25.Amount > 0 && (d.isArray(5))) {delay = Game.Wager.Duo25.Win(5, delay)}
                if (Game.Wager.Duo34.Amount > 0 && (d.isArray(4))) {delay = Game.Wager.Duo34.Win(5, delay)}
                break;
            }

            case 10:
            {
                if (Game.Wager.Sum10.Amount > 0) {delay = Game.Wager.Sum5.Win(6 ,delay)}
                if (Game.Wager.Low.Amount > 0) {delay = Game.Wager.Low.Amount.Win(1, delay)}
                break;
            }

            case 11:
            {
                if (Game.Wager.Sum11.Amount > 0) {delay = Game.Wager.Sum5.Win(6 ,delay)}
                if (Game.Wager.High.Amount > 0) {delay = Game.Wager.High.Win(1, delay)}
                break;
            }

            case 12:
            {
                if (Game.Wager.Sum12.Amount > 0) {delay = Game.Wager.Sum5.Win(7 ,delay)}

                if (die1 === die2 === die3) {delay = Game.Wager.High.Lose(delay)}else{delay = Game.Wager.High.Win(1, delay)}
                if (Game.Wager.ThreeOfKindFour.Amount > 0 && (die1 === die2 === die3)) {delay = Game.Wager.ThreeOfKindFour.Win(180, delay)}
                break;
            }

            case 13:
            {
                if (Game.Wager.Sum13.Amount > 0) {delay = Game.Wager.Sum5.Win(8 ,delay)}
                if (Game.Wager.High.Amount > 0) {delay = Game.Wager.High.Win(1, delay)}
                break;
            }
            // 14 = 6 + 6 + 2 = 5 + 5 + 4 = 4 + 4 + 6 = 6 + 5 + 3
            case 14:
            {
                if (Game.Wager.Sum14.Amount > 0) {delay = Game.Wager.Sum5.Win(12 ,delay)}
                if (Game.Wager.High.Amount > 0) {delay = Game.Wager.High.Win(1, delay)}
                break;
            }
            // 15 = 6 + 6 + 3 = 6 + 5 + 4 = 5 + 5 + 5
            case 15:
            {
                if (Game.Wager.Sum15.Amount > 0) {delay = Game.Wager.Sum5.Win(18 ,delay)}

                if (die1 === die2 === die3) {delay = Game.Wager.High.Lose(delay)}else{delay = Game.Wager.High.Win(1, delay)}
                if (Game.Wager.ThreeOfKindFive.Amount > 0 && (die1 === die2 === die3)) {delay = Game.Wager.ThreeOfKindFive.Win(180, delay)}

                if (Game.Wager.OneOfKind6 > 0 && (d.isArray(3))) {delay = Game.Wager.OneOfKind6.Win(2, delay)}
                if (Game.Wager.OneOfKind6 > 0 && (d.isArray(4))) {delay = Game.Wager.OneOfKind6.Win(1, delay)}
                if (Game.Wager.OneOfKind5 > 0 && (d.isArray(6))) {delay = Game.Wager.OneOfKind5.Win(1, delay)}
                if (Game.Wager.OneOfKind5 > 0 && (die1 === die2 === die3)) {delay = Game.Wager.OneOfKind5.Win(12, delay)}
                if (Game.Wager.OneOfKind3 > 0 && (d.isArray(3))) {delay = Game.Wager.OneOfKind3.Win(1, delay)}
                if (Game.Wager.OneOfKind4 > 0 && (d.isArray(4))) {delay = Game.Wager.OneOfKind4.Win(1, delay)}

                if (Game.Wager.TwoOfKindSix > 0 && (d.isArray(3))) {delay = Game.Wager.TwoOfKindSix.Win(10, delay)}
                if (Game.Wager.TwoOfKindTwo > 0 && (die1 === die2 === die3)) {delay = Game.Wager.TwoOfKindTwo.Win(10, delay)}

                if (Game.Wager.Duo36.Amount > 0 && (d.isArray(3))) {delay = Game.Wager.Duo36.Win(5, delay)}
                if (Game.Wager.Duo45.Amount > 0 && (d.isArray(4))) {delay = Game.Wager.Duo45.Win(5, delay)}
                if (Game.Wager.Duo46.Amount > 0 && (d.isArray(4))) {delay = Game.Wager.Duo46.Win(5, delay)}
                if (Game.Wager.Duo56.Amount > 0 && (d.isArray(4))) {delay = Game.Wager.Duo56.Win(5, delay)}
                break;
            }
            // 16 = 6 + 6 + 4 = 5 + 5 + 6
            case 16:
            {
                if (Game.Wager.Sum16.Amount > 0) {delay = Game.Wager.Sum5.Win(30 ,delay)}

                if (Game.Wager.High.Amount > 0) {delay = Game.Wager.High.Win(1, delay)}

                if (Game.Wager.OneOfKind6 > 0 && (d.isArray(4) == true)) 
                {
                    delay = Game.Wager.OneOfKind1.Win(2, delay)
                }
                else
                {
                    delay = Game.Wager.OneOfKind1.Win(1, delay)
                }
                if (Game.Wager.TwoOfKindFive > 0 && (d.isArray(5) == true)) {delay = Game.Wager.TwoOfKindFive.Win(10, delay)}
                if (Game.Wager.TwoOfKindSix > 0 && (d.isArray(4) == true)) {delay = Game.Wager.TwoOfKindSix.Win(10, delay)}
                    
                if (Game.Wager.Duo46.Amount > 0 && (d.isArray(4) == true)) {delay = Game.Wager.Duo46.Win(5, delay)}
                if (Game.Wager.Duo56.Amount > 0 && (d.isArray(5) == true)) {delay = Game.Wager.Duo56.Win(5, delay)}
                break;
            }
            // 17 = 6 + 6 + 5
            case 17:
            {
                if (Game.Wager.Sum17.Amount > 0) {delay = Game.Wager.Sum5.Win(60 ,delay)}

                if (Game.Wager.High.Amount > 0) {delay = Game.Wager.High.Win(1, delay)}

                if (Game.Wager.OneOfKind6 > 0) {delay = Game.Wager.OneOfKind6.Win(2, delay)}
                if (Game.Wager.TwoOfKindSix > 0) {delay = Game.Wager.TwoOfKindSix.Win(10, delay)}
                if (Game.Wager.Duo56.Amount > 0) {delay = Game.Wager.Duo56.Win(5, delay)}
                break;
            }
            // 18 = 6 + 6 + 6
            case 18:
            {
                if (Game.Wager.AllThree.Amount > 0) {delay = Game.Wager.AllThree.Win(30, delay)}
                if (Game.Wager.High.Amount > 0) {delay = Game.Wager.High.Lose(delay)}
                if (Game.Wager.ThreeOfKindSix.Amount > 0 && (die1 === die2 === die3)) {delay = Game.Wager.ThreeOfKindSix.Win(180, delay)}
                if (Game.Wager.OneOfKind6 > 0) {delay = Game.Wager.OneOfKind6.Win(12, delay)}
                break;
            }
        }
    }
};

window.onload = function()
{
    Game.Initialize();
};

