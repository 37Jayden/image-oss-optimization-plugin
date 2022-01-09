package com.example.reactnativeapplication;

import com.facebook.react.ReactActivity;

public class MyReactActivity extends ReactActivity {

    @Override
    protected String getMainComponentName() {
        return "MyReactNativeApp";   //application即注册ReactNative时的名称;
    }

//    private ReactRootView mReactRootView;
//    private ReactInstanceManager mReactInstanceManager;

//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//        SoLoader.init(this, false);
//
//        mReactRootView = new ReactRootView(this);
//        List<ReactPackage> packages = new PackageList(getApplication()).getPackages();
//        // 有一些第三方可能不能自动链接，对于这些包我们可以用下面的方式手动添加进来：
//         packages.add(new RNScreensPackage());
//         packages.add(new SafeAreaContextPackage());
//        // 同时需要手动把他们添加到`settings.gradle`和 `app/build.gradle`配置文件中。
//
//        mReactInstanceManager = ReactInstanceManager.builder()
//                .setApplication(getApplication())
//                .setCurrentActivity(this)
//                .setBundleAssetName("index.android.bundle")
//                .setJSMainModulePath("index")
//                .addPackages(packages)
//                .setUseDeveloperSupport(BuildConfig.DEBUG)
//                .setInitialLifecycleState(LifecycleState.RESUMED)
//                .build();
//        // 注意这里的MyReactNativeApp 必须对应"index.js"中的
//        // "AppRegistry.registerComponent()"的第一个参数
//        mReactRootView.startReactApplication(mReactInstanceManager, "MyReactNativeApp", null);
//
//        setContentView(mReactRootView);
//    }

//    @Override
//    public void invokeDefaultOnBackPressed() {
//        super.onBackPressed();
//    }
//
//    @Override
//    protected void onPause() {
//        super.onPause();
//
//        if (mReactInstanceManager != null) {
//            mReactInstanceManager.onHostPause(this);
//        }
//    }
//
//    @Override
//    protected void onResume() {
//        super.onResume();
//
//        if (mReactInstanceManager != null) {
//            mReactInstanceManager.onHostResume(this, this);
//        }
//    }
//
//    @Override
//    protected void onDestroy() {
//        super.onDestroy();
//
//        if (mReactInstanceManager != null) {
//            mReactInstanceManager.onHostDestroy(this);
//        }
//        if (mReactRootView != null) {
//            mReactRootView.unmountReactApplication();
//        }
//    }
//
//    @Override
//    public boolean onKeyUp(int keyCode, KeyEvent event) {
//        if (keyCode == KeyEvent.KEYCODE_MENU && mReactInstanceManager != null) {
//            mReactInstanceManager.showDevOptionsDialog();
//            return true;
//        }
//        return super.onKeyUp(keyCode, event);
//    }
}
