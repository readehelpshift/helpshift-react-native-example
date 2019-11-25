/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import "HelpshiftCore.h"
#import "HelpshiftSupport.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
  // Register for push notifications
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;
  [center requestAuthorizationWithOptions:(UNAuthorizationOptionBadge | UNAuthorizationOptionSound | UNAuthorizationOptionAlert)
                        completionHandler:^(BOOL granted, NSError *_Nullable error) {
                          if(error) {
                            NSLog(@"Error while requesting Notification permissions.");
                          }
                        }];
  [[UIApplication sharedApplication] registerForRemoteNotifications];
  
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"HelpshiftRNExample"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
  // Set application icon badge number to an appropriate value
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
}
#pragma mark Notification Delegates
- (void) application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [HelpshiftCore registerDeviceToken:deviceToken];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
  NSLog(@"willPresentNotification");
  if([[notification.request.content.userInfo objectForKey:@"origin"] isEqualToString:@"helpshift"]) {
    [HelpshiftCore handleNotificationWithUserInfoDictionary:notification.request.content.userInfo
                                                isAppLaunch:false
                                             withController:self.window.rootViewController];
  }
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler {
  NSLog(@"didReceiveNotificationResponse");
  if([[response.notification.request.content.userInfo objectForKey:@"origin"] isEqualToString:@"helpshift"]) {
    [HelpshiftCore handleNotificationResponseWithActionIdentifier:response.actionIdentifier
                                                         userInfo:response.notification.request.content.userInfo
                                                completionHandler:completionHandler];
  }
  completionHandler();
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
