import { sort } from './main';


describe('naturalSort', () => {
    describe('different values types - numbers vs numeric strings', () => {
        it('should always sort number first', () => {
            expect(sort(['a', 1])).toEqual([1, 'a']);
        });

        it('should remain unchanged (error in chrome)', () => {
            expect(sort([1, '1'])).toEqual([1, '1']);
        });

        it('should sort padded numeric string before numbers', () => {
            expect(sort(['02', 3, 2, '01'])).toEqual(['01', '02', 2, 3]);
        });
    });

    describe('dateTime', () => {
        it('should sort similar date strings', () => {
            expect(sort(['10/12/2008', '10/11/2008', '10/11/2007', '10/12/2007'])).toEqual(['10/11/2007', '10/12/2007', '10/11/2008', '10/12/2008']);
            expect(sort(['01/01/2008', '01/10/2008', '01/01/1992', '01/01/1991'])).toEqual(['01/01/1991', '01/01/1992', '01/01/2008', '01/10/2008']);
        });

        it('should sort similar date strings from javascript toString(), different timezones', () => {
            expect(sort([
                'Wed Jan 01 2010 00:00:00 GMT-0800 (Pacific Standard Time)',
                'Thu Dec 31 2009 00:00:00 GMT-0800 (Pacific Standard Time)',
                'Wed Jan 01 2010 00:00:00 GMT-0500 (Eastern Standard Time)'
            ])).toEqual([
                'Thu Dec 31 2009 00:00:00 GMT-0800 (Pacific Standard Time)',
                'Wed Jan 01 2010 00:00:00 GMT-0500 (Eastern Standard Time)',
                'Wed Jan 01 2010 00:00:00 GMT-0800 (Pacific Standard Time)'
            ]);
        });

        it('should sort similar date strings from Date.toString(), Date.toLocaleString()', () => {
            expect(sort([
                'Saturday, July 3, 2010',
                'Monday, August 2, 2010',
                'Monday, May 3, 2010'
            ])).toEqual([
                'Monday, May 3, 2010',
                'Saturday, July 3, 2010',
                'Monday, August 2, 2010'
            ]);
        });

        it('should sort similar date strings from Date.toUTCString()', () => {
            expect(sort([
                'Mon, 15 Jun 2009 20:45:30 GMT',
                'Mon, 3 May 2010 17:45:30 GMT',
                'Mon, 15 Jun 2009 17:45:30 GMT'
            ])).toEqual([
                'Mon, 15 Jun 2009 17:45:30 GMT',
                'Mon, 15 Jun 2009 20:45:30 GMT',
                'Mon, 3 May 2010 17:45:30 GMT'
            ]);

            expect(sort([
                'Saturday, July 3, 2010 1:45 PM',
                'Saturday, July 3, 2010 1:45 AM',
                'Monday, August 2, 2010 1:45 PM',
                'Monday, May 3, 2010 1:45 PM'
            ])).toEqual([
                'Monday, May 3, 2010 1:45 PM',
                'Saturday, July 3, 2010 1:45 AM',
                'Saturday, July 3, 2010 1:45 PM',
                'Monday, August 2, 2010 1:45 PM'
            ]);

            expect(sort([
                'Saturday, July 3, 2010 1:45:30 PM',
                'Saturday, July 3, 2010 1:45:29 PM',
                'Monday, August 2, 2010 1:45:01 PM',
                'Monday, May 3, 2010 1:45:00 PM'
            ])).toEqual([
                'Monday, May 3, 2010 1:45:00 PM',
                'Saturday, July 3, 2010 1:45:29 PM',
                'Saturday, July 3, 2010 1:45:30 PM',
                'Monday, August 2, 2010 1:45:01 PM'
            ]);

            expect(sort([
                '2/15/2009 1:45 PM',
                '1/15/2009 1:45 PM',
                '2/15/2009 1:45 AM'
            ])).toEqual([
                '1/15/2009 1:45 PM',
                '2/15/2009 1:45 AM',
                '2/15/2009 1:45 PM'
            ]);
        });

        it('should sort similar ISO8601 Dates date strings', () => {
            expect(sort([
                '2010-06-15T13:45:30',
                '2009-06-15T13:45:30',
                '2009-06-15T01:45:30.2',
                '2009-01-15T01:45:30'
            ])).toEqual([
                '2009-01-15T01:45:30',
                '2009-06-15T01:45:30.2',
                '2009-06-15T13:45:30',
                '2010-06-15T13:45:30'
            ]);
        });
    });

    it('should sort  ISO8601-ish YYYY-MM-DDThh:mm:ss date string- which do not parse into a Date instance', () => {
        expect(sort([
            '2010-06-15 13:45:30',
            '2009-06-15 13:45:30',
            '2009-01-15 01:45:30'
        ])).toEqual([
            '2009-01-15 01:45:30',
            '2009-06-15 13:45:30',
            '2010-06-15 13:45:30'
        ]);
    });

    it('should sort similar RFC1123 Date strings with different timezones', () => {
        expect(sort([
            'Mon, 15 Jun 2009 20:45:30 GMT',
            'Mon, 15 Jun 2009 20:45:30 PDT',
            'Mon, 15 Jun 2009 20:45:30 EST',
        ])).toEqual([
            'Mon, 15 Jun 2009 20:45:30 GMT',
            'Mon, 15 Jun 2009 20:45:30 EST',
            'Mon, 15 Jun 2009 20:45:30 PDT'
        ]);
    });

    it('should sort similar Date strings from unix epoch, Date.getTime()', () => {
        expect(sort([
            '1245098730000',
            '14330728000',
            '1245098728000'
        ])).toEqual([
            '14330728000',
            '1245098728000',
            '1245098730000'
        ]);
    });

    describe('version number strings', () => {
        it('should sort mixed strings and numbers', () => {
            expect(sort(['10', 9, 2, '1', '4'])).toEqual(['1', 2, '4', 9, '10']);
        });

        it('should sort 0 left-padded numeric strings', () => {
            expect(sort(['0001', '002', '001'])).toEqual(['0001', '001', '002']);
        });

        it('should sort 0 left-padded numbers and regular numbers', () => {
            expect(sort(['10.0401', 10.022, 10.042, '10.021999'])).toEqual(['10.021999', 10.022, '10.0401', 10.042]);
        });

        it('should sort mixed decimal strings and decimals with the same precision', () => {
            expect(sort(['10.04', 10.02, 10.03, '10.01'])).toEqual(['10.01', 10.02, 10.03, '10.04']);
        });

        it('should sort float/decimal strings with \'F\' or \'D\' notation', () => {
            expect(sort(['10.04f', '10.039F', '10.038d', '10.037D'])).toEqual(['10.037D', '10.038d', '10.039F', '10.04f']);
        });

        it('should sort numeric strings with no float/decimal notation', () => {
            expect(sort(['10.004Z', '10.039T', '10.038ooo', '10.037g'])).toEqual(['10.004Z', '10.037g', '10.038ooo', '10.039T']);
        });

        it('should sort numeric strings in scientific notation', () => {
            expect(sort(['1.528535047e5', '1.528535047e7', '1.52e15', '1.528535047e3', '1.59e-3'])).toEqual(['1.59e-3', '1.528535047e3', '1.528535047e5', '1.528535047e7', '1.52e15']);
        });

        it('should sort negative number strings', () => {
            expect(sort(['-1', '-2', '4', '-3', '0', '-5'])).toEqual(['-5', '-3', '-2', '-1', '0', '4']);
        });

        it('should sort mixed negative number strings and negative numbers', () => {
            expect(sort([-1, '-2', 4, -3, '0', '-5'])).toEqual(['-5', -3, '-2', -1, '0', 4]);
        });

        it('should sort negative floats', () => {
            expect(sort([-2.01, -2.1, 4.144, 4.1, -2.001, -5])).toEqual([-5, -2.1, -2.01, -2.001, 4.1, 4.144]);
        });
    });

    describe('IP addresses', () => {
        it('should sort IP address strings', () => {
            expect(sort([
                '192.168.0.100',
                '192.168.0.1',
                '192.168.1.1',
                '192.168.0.250',
                '192.168.1.123',
                '10.0.0.2',
                '10.0.0.1'
            ])).toEqual([
                '10.0.0.1',
                '10.0.0.2',
                '192.168.0.1',
                '192.168.0.100',
                '192.168.0.250',
                '192.168.1.1',
                '192.168.1.123'
            ]);
        });
    });

    describe('filenames', () => {
        it('should sort simple filenames', () => {
            expect(sort(['img12.png', 'img10.png', 'img2.png', 'img1.png'])).toEqual(['img1.png', 'img2.png', 'img10.png', 'img12.png']);
        });

        it('should sort complex filenames', () => {
            expect(sort(['car.mov', '01alpha.sgi', '001alpha.sgi', 'my.string_41299.tif', 'organic2.0001.sgi'])).toEqual(['001alpha.sgi', '01alpha.sgi', 'car.mov', 'my.string_41299.tif', 'organic2.0001.sgi']);
        });

        it('should sort unix filenames', () => {
            expect(sort([
                './system/kernel/js/01_ui.core.js',
                './system/kernel/js/00_jquery-1.3.2.js',
                './system/kernel/js/02_my.desktop.js'
            ])).toEqual([
                './system/kernel/js/00_jquery-1.3.2.js',
                './system/kernel/js/01_ui.core.js',
                './system/kernel/js/02_my.desktop.js'
            ]);
        });
    });

    describe('empty strings and space(s)', () => {
        it('should sort empty strings and space(s) first', () => {
            expect(sort(['alpha', ' 1', '  3', ' 2', 0])).toEqual([0, ' 1', ' 2', '  3', 'alpha']);
            expect(sort(['10023', '999', '', 2, 5.663, 5.6629])).toEqual(['', 2, 5.6629, 5.663, '999', '10023']);
            expect(sort([0, '0', ''])).toEqual([0, '0', '']);
        });
    });

    describe('hex', () => {
        it('should sort valid hex numeric strings', () => {
            expect(sort(['0xA', '0x9', '0x99'])).toEqual(['0x9', '0xA', '0x99']);
        });

        it('should sort invalid hex numeric strings', () => {
            expect(sort(['0xZZ', '0xVVV', '0xVEV', '0xUU'])).toEqual(['0xUU', '0xVEV', '0xVVV', '0xZZ']);
        });
    });

    describe('unicode', () => {
        it('should sort unicode characters', () => {
            expect(sort(['\u0044', '\u0055', '\u0054', '\u0043'])).toEqual(['\u0043', '\u0044', '\u0054', '\u0055']);
        });
    });

    describe('sparse array sort', () => {
        it('should sort simple sparse arrays', () => {
            const mockArray: (number | undefined)[] = [3, 2];

            const expected: (number | undefined)[] = [1, 2, 3];

            mockArray[10] = 1;

            for (var i = 0; i < 8; i++) expected.push(undefined);

            expect(sort(mockArray)).toEqual(expected);
        });
    });

    describe('case sensitivity', () => {
        it('should sort case insensitive pre-sorted array', () => {
            expect(sort(['A', 'b', 'C', 'd', 'E', 'f'], true)).toEqual(['A', 'b', 'C', 'd', 'E', 'f']);
        });

        it('should sort case insensitive unsorted array', () => {
            expect(sort(['A', 'C', 'E', 'b', 'd', 'f'], true)).toEqual(['A', 'b', 'C', 'd', 'E', 'f']);
        });

        it('should sort case sensitive unsorted array', () => {
            expect(sort(['A', 'C', 'E', 'b', 'd', 'f'], false)).toEqual(['A', 'C', 'E', 'b', 'd', 'f']);
        });

        it('should sort case sensitive unsorted array', () => {
            expect(sort(['A', 'b', 'C', 'd', 'E', 'f'], false)).toEqual(['A', 'C', 'E', 'b', 'd', 'f']);
        });
    });

    describe('complex array values', () => {
        it('contributed by Scott to to natural-sort-js', () => {
            expect(sort([
                'FSI stop, Position: 5',
                'Mail Group stop, Position: 5',
                'Mail Group stop, Position: 5',
                'FSI stop, Position: 6',
                'FSI stop, Position: 6',
                'Newsstand stop, Position: 4',
                'Newsstand stop, Position: 4',
                'FSI stop, Position: 5'
            ])).toEqual([
                'FSI stop, Position: 5',
                'FSI stop, Position: 5',
                'FSI stop, Position: 6',
                'FSI stop, Position: 6',
                'Mail Group stop, Position: 5',
                'Mail Group stop, Position: 5',
                'Newsstand stop, Position: 4',
                'Newsstand stop, Position: 4'
            ]);
        });

        it('contributed by Bob Zeiner to natural-sort-js', () => {
            expect(sort(['T78', 'U17', 'U10', 'U12', 'U14', '745', 'U7', '01', '485', 'S16', 'S2', 'S22', '1081', 'S25', '1055', '779', '776', '771', '44', '4', '87', '1091', '42', '480', '952', '951', '756', '1000', '824', '770', '666', '633', '619', '1', '991', '77H', 'PIER-7', '47', '29', '9', '77L', '433'])).toEqual(['01', '1', '4', '9', '29', '42', '44', '47', '77H', '77L', '87', '433', '480', '485', '619', '633', '666', '745', '756', '770', '771', '776', '779', '824', '951', '952', '991', '1000', '1055', '1081', '1091', 'PIER-7', 'S2', 'S16', 'S22', 'S25', 'T78', 'U7', 'U10', 'U12', 'U14', 'U17']);
        });

        it('undefined support - contributed by jarvinen pekka to natural-sort-js', () => {
            expect(sort([2, 10, 1, 'azd', undefined, 'asd'])).toEqual([1, 2, 10, 'asd', 'azd', undefined]);
            expect(sort([undefined, undefined, undefined, 1, undefined])).toEqual([1, undefined, undefined, undefined]);
        });

        it('invalid numeric string sorting - contributed by guilermo.dev to natural-sort-js', () => {
            expect(sort(['-1', '-2', '4', '-3', '0', '-5'])).toEqual(['-5', '-3', '-2', '-1', '0', '4']);
        });

        it('invalid sort order - contributed by Howie Schecter to natural-sort-js', () => {
            expect(sort(['9', '11', '22', '99', 'A', 'aaaa', 'bbbb', 'Aaaa', 'aAaa', 'aa', 'AA', 'Aa', 'aA', 'BB', 'bB', 'aaA', 'AaA', 'aaa'], true)).toEqual(['9', '11', '22', '99', 'A', 'aa', 'AA', 'Aa', 'aA', 'aaA', 'AaA', 'aaa', 'aaaa', 'Aaaa', 'aAaa', 'BB', 'bB', 'bbbb']);
            expect(sort(['9', '11', '22', '99', 'A', 'aaaa', 'bbbb', 'Aaaa', 'aAaa', 'aa', 'AA', 'Aa', 'aA', 'BB', 'bB', 'aaA', 'AaA', 'aaa'], false)).toEqual(['9', '11', '22', '99', 'A', 'AA', 'Aa', 'AaA', 'Aaaa', 'BB', 'aA', 'aAaa', 'aa', 'aaA', 'aaa', 'aaaa', 'bB', 'bbbb']);
        });

        describe('should sort alphanumeric strings with number first', () => {
            expect(sort(['5D','1A','2D','33A','5E','33K','33D','5S','2C','5C','5F','1D','2M'])).toEqual(['1A','1D','2C','2D','2M','5C','5D','5E','5F','5S','33A','33D','33K']);
        });
    });
});
