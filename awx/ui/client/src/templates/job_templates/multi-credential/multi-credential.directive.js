/*************************************************
 * Copyright (c) 2017 Ansible, Inc.
 *
 * All Rights Reserved
 *************************************************/

export default ['templateUrl', '$compile',
    function(templateUrl, $compile) {
        return {
            scope: {
                credentials: '=',
                selectedCredentials: '=',
                prompt: '=',
                credentialNotPresent: '=',
                credentialsToPost: '='
            },
            restrict: 'E',
            templateUrl: templateUrl('templates/job_templates/multi-credential/multi-credential'),
            controller: ['$scope',
                function($scope) {
                    if (!$scope.selectedCredentials) {
                        $scope.selectedCredentials = {
                            machine: null,
                            extra: []
                        };
                    }

                    if (!$scope.credentialsToPost) {
                        $scope.credentialsToPost = [];
                    }

                    $scope.fieldDirty = false;

                    $scope.$watchGroup(['prompt', 'credentialsToPost'],
                        function() {
                            if ($scope.prompt ||
                                $scope.credentialsToPost.length) {
                                    $scope.fieldDirty = true;
                            }

                            $scope.credentialNotPresent = !$scope.prompt &&
                                $scope.selectedCredentials.machine === null;
                    });

                    $scope.removeCredential = function(credToRemove) {
                        $scope.credentialsToPost = $scope.credentialsToPost
                            .filter(function(cred) {
                                if (cred.id === credToRemove) {
                                    if (cred.postType === 'machine') {
                                        $scope.selectedCredentials.machine = null;
                                    } else {
                                        $scope.selectedCredentials
                                            .extra = $scope.selectedCredentials
                                                .extra
                                                .filter(selectedCred => {
                                                    return selectedCred
                                                        .id !== credToRemove;
                                                });
                                    }
                                }
                                return cred.id !== credToRemove;
                            });
                    };
                }
            ],
            link: function(scope) {
                scope.openMultiCredentialModal = function() {
                    $('#content-container')
                        .append($compile(`
                            <multi-credential-modal
                                credentials="credentials"
                                credentials-to-post="credentialsToPost"
                                selected-credentials="selectedCredentials">
                            </multi-credential-modal>`)(scope));
                };
            }
        };
    }
];
