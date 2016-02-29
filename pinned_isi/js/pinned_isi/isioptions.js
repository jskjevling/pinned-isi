var isiOptions = {
    wrapper: "#pinned-isi-footer",
    mobileIndication: ".mobile-ind",
    mainIndication: ".main-ind",
    isiBtn: ".isi-btn",
    indBtn: ".ind-btn",
    filePath: "isi.html",
    breakpoints: {
        large: {
            maxWidth: 999999,
            minWidth: 1005,
            mobileStacking: false,
            pinned: {
                isi: {
                    top: "66%",
                    position: "fixed",
                    borderTop: ""
                },
                expandBtn: {
                    width: '114px',
                    backgroundColor: '#a6afd6',
                    cursor: 'pointer',
                    transition: 'background-color .25s ease-in-out'
                },
                expandText: 'Expand +',
                retractText: 'Return -',
                customStyles: {

                }
            },
            expanded: {
                isi: {
                    top: "8px",
                    position: "absolute"
                },
                expandBtn: {
                    width: '114px',
                    backgroundColor: '#a6afd6',
                    cursor: 'pointer',
                    transition: 'background-color .25s ease-in-out'
                },
                expandText: 'Expand +',
                retractText: 'Return -',
                customStyles: {

                }
            },
            flow: {
                isi: {
                    top: "",
                    position: "static",
                    borderTop: "none",
                },
                expandBtn: {
                    width: '114px',
                    backgroundColor: '#fff',
                    cursor: 'default',
                    transition: 'background-color .25s ease-in-out'
                },
                expandText: '',
                retractText: '',
                customStyles: {

                }
            }
        },
        mobile: {
            maxWidth: 1004,
            minWidth: 0,
            mobileStacking: true,
            pinned: {
                isi: {
                    top: "66%",
                    position: "fixed",
                    borderTop: ''
                },
                expandBtn: {
                    width: '44px',
                    backgroundColor: '#a6afd6',
                    cursor: 'pointer',
                    transition: 'background-color .25s ease-in-out'
                },
                expandText: '+',
                retractText: '-',
                customStyles: {
                    element: {
                        selector: '.mobile-ind',
                        styles: {
                            borderBottom: ''
                        }
                    }
                }
            },
            expanded: {
                isi: {
                    top: "8px",
                    position: "absolute"
                },
                expandBtn: {
                    width: '44px',
                    backgroundColor: '#a6afd6',
                    cursor: 'pointer',
                    transition: 'background-color .25s ease-in-out'
                },
                expandText: '+',
                retractText: '-',
                customStyles: {

                }
            },
            flow: {
                isi: {
                    top: "",
                    position: "static",
                    borderTop: "none"
                },
                expandBtn: {
                    width: '44px',
                    backgroundColor: '#fff',
                    cursor: 'default',
                    transition: 'background-color .25s ease-in-out'
                },
                expandText: '',
                retractText: '',
                customStyles: {
                    element: {
                        selector: '.mobile-ind',
                        styles: {
                            borderBottom: 'none'
                        }
                    }
                }
            }
        }
    },
    callback: function() {
        /* ====================================================
            External Link Pop Up
           ==================================================== */

        $('a.externalLink').click(function(e) {
            e.preventDefault(); // Prevent the href from redirecting directly
            var linkURL = $(this).attr("href");
            warnBeforeRedirect(linkURL);
        });

        window.warnBeforeRedirect = function warnBeforeRedirect(linkURL) {
            swal({
                title: "",
                text: "<p>This link will take you to another website that is unrelated to the Janssen Pharmaceuticals, Inc. TOPAMAX<sup>&reg;</sup> website and to which the <a href='legal.html'>Legal Notice</a> and <a href='privacy.html'>Privacy Policy</a> of the Janssen Pharmaceuticals, Inc. TOPAMAX<sup>&reg;</sup> website do not apply. We encourage you to read the <a href='legal.html'>Legal Notice</a> and <a href='privacy.html'>Privacy Policy</a> of every website you visit.</p> <p>Click the Cancel button to return to www.topamax.com or OK to continue.</p>",
                html: true,
                showCancelButton: true

            }, function() {
                // Redirect the user
                window.location.href = linkURL;
            });
        }

    },
    expandIndicator: {
        expandImg: '',
        retractImg: ''
    }
};
