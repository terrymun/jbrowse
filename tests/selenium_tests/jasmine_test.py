import unittest
from jbrowse_selenium import JBrowseTest

class JasmineTest( JBrowseTest, unittest.TestCase ):

    data_dir = 'tests/js_tests/index.html'
    base_url = 'http://localhost/'
    def setUp( self ):
        super( JasmineTest, self ).setUp()

    def test_jasmine( self ):
        self.assert_element(".duration", 30)
        self.assert_no_element(".failingAlert")
        self.assert_no_js_errors()
