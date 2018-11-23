import { test, assertEqual } from "https://deno.land/x/testing/testing.ts";
import parseArgs from '../index.ts';


test(function _arseArgs() {
    assertEqual(
        parseArgs([ '--no-moo' ]),
        { moo : false, _ : [] },
    );
    assertEqual(
        parseArgs([ '-v', 'a', '-v', 'b', '-v', 'c' ]),
        { v : ['a','b','c'], _ : [] },
    );
});
 
test(function comprehensive() {
    assertEqual(
        parseArgs([
            '--name=meowmers', 'bare', '-cats', 'woo',
            '-h', 'awesome', '--multi=quux',
            '--key', 'value',
            '-b', '--bool', '--no-meep', '--multi=baz',
            '--', '--not-a-flag', 'eek'
        ]),
        {
            c : true,
            a : true,
            t : true,
            s : 'woo',
            h : 'awesome',
            b : true,
            bool : true,
            key : 'value',
            multi : [ 'quux', 'baz' ],
            meep : false,
            name : 'meowmers',
            _ : [ 'bare', '--not-a-flag', 'eek' ]
        }
    );
});

test(function flagBoolean() {
    const argv = parseArgs([ '-t', 'moo' ], { boolean: 't' });
    assertEqual(argv, { t : true, _ : [ 'moo' ] });
    assertEqual(typeof argv.t, 'boolean');
});

test(function flagBooleanValue() {
    const argv = parseArgs(['--verbose', 'false', 'moo', '-t', 'true'], {
        boolean: [ 't', 'verbose' ],
        default: { verbose: true }
    });
    
    assertEqual(argv, {
        verbose: false,
        t: true,
        _: ['moo']
    });
    
    assertEqual(typeof argv.verbose, 'boolean');
    assertEqual(typeof argv.t, 'boolean');
});

test(function newlinesInParams() {
    const args = parseArgs([ '-s', "X\nX" ])
    assertEqual(args, { _ : [], s : "X\nX" });
    
    // reproduce in bash:
    // VALUE="new
    // line"
    // deno program.js --s="$VALUE"
    const args2 = parseArgs([ "--s=X\nX" ])
    assertEqual(args2, { _ : [], s : "X\nX" });
});

test(function strings() {
    const s = parseArgs([ '-s', '0001234' ], { string: 's' }).s;
    assertEqual(s, '0001234');
    assertEqual(typeof s, 'string');
    
    const x = parseArgs([ '-x', '56' ], { string: 'x' }).x;
    assertEqual(x, '56');
    assertEqual(typeof x, 'string');
});

test(function stringArgs() {
    const s = parseArgs([ '  ', '  ' ], { string: '_' })._;
    assertEqual(s.length, 2);
    assertEqual(typeof s[0], 'string');
    assertEqual(s[0], '  ');
    assertEqual(typeof s[1], 'string');
    assertEqual(s[1], '  ');
});

test(function emptyStrings() {
    const s = parseArgs([ '-s' ], { string: 's' }).s;
    assertEqual(s, '');
    assertEqual(typeof s, 'string');

    const str = parseArgs([ '--str' ], { string: 'str' }).str;
    assertEqual(str, '');
    assertEqual(typeof str, 'string');

    const letters = parseArgs([ '-art' ], {
        string: [ 'a', 't' ]
    });

    assertEqual(letters.a, '');
    assertEqual(letters.r, true);
    assertEqual(letters.t, '');
});


test(function stringAndAlias() {
    const x = parseArgs([ '--str',  '000123' ], {
        string: 's',
        alias: { s: 'str' }
    });

    assertEqual(x.str, '000123');
    assertEqual(typeof x.str, 'string');
    assertEqual(x.s, '000123');
    assertEqual(typeof x.s, 'string');

    const y = parseArgs([ '-s',  '000123' ], {
        string: 'str',
        alias: { str: 's' }
    });

    assertEqual(y.str, '000123');
    assertEqual(typeof y.str, 'string');
    assertEqual(y.s, '000123');
    assertEqual(typeof y.s, 'string');
});

test(function slashBreak() {
    assertEqual(
        parseArgs([ '-I/foo/bar/baz' ]),
        { I : '/foo/bar/baz', _ : [] }
    );
    assertEqual(
        parseArgs([ '-xyz/foo/bar/baz' ]),
        { x : true, y : true, z : '/foo/bar/baz', _ : [] }
    );
});

test(function alias() {
    const argv = parseArgs([ '-f', '11', '--zoom', '55' ], {
        alias: { z: 'zoom' }
    });
    assertEqual(argv.zoom, 55);
    assertEqual(argv.z, argv.zoom);
    assertEqual(argv.f, 11);
});

test(function multiAlias() {
    const argv = parseArgs([ '-f', '11', '--zoom', '55' ], {
        alias: { z: [ 'zm', 'zoom' ] }
    });
    assertEqual(argv.zoom, 55);
    assertEqual(argv.z, argv.zoom);
    assertEqual(argv.z, argv.zm);
    assertEqual(argv.f, 11);
});

test(function nestedDottedObjects() {
    const argv = parseArgs([
        '--foo.bar', '3', '--foo.baz', '4',
        '--foo.quux.quibble', '5', '--foo.quux.o_O',
        '--beep.boop'
    ]);
    
    assertEqual(argv.foo, {
        bar : 3,
        baz : 4,
        quux : {
            quibble : 5,
            o_O : true
        }
    });
    assertEqual(argv.beep, { boop : true });
});