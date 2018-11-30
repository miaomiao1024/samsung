
mainApp.directive('ngCopyable', function($document) {
    return {
        restrict: 'A',
        scope: {
            copyText: '='
        },
        link: function(scope, element, attrs){
            //点击事件
            element.bind('click', function(){
                //创建将被复制的内容
                $document.find('body').eq(0).append('<div id="ngCopyableId">' + scope.copyText + '</div>');
                var newElem = angular.element(document.getElementById('ngCopyableId'))[0];

                var range = document.createRange();
                range.selectNode(newElem);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                var successful = document.execCommand('copy');

                //执行完毕删除
                var oldElem = document.getElementById('ngCopyableId');
                oldElem.parentNode.removeChild(oldElem);
                window.getSelection().removeAllRanges();

                //提示
                if (successful) {
                    alert('已成功复制：' + scope.copyText);
                } else {
                    alert('浏览器不支持复制');
                }

            });
        }

    };
});