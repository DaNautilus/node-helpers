import { PublishSubscribe } from '../../src/publish-subscribe';

describe('PublishSubscribe', () => {
  class PubSubTest extends PublishSubscribe {
    public static messageIds = {
      message1: 'pubSubTest:message1',
      message2: 'pubSubTest:message2',
    };

    public sendMessage(messageId: string | undefined, message: string): void {
      this.publish(messageId, message);
    }

    public clearAllSubscriptions(): void {
      this.unsubscribeAll();
    }
  }

  let pubSubTest: PubSubTest;
  const testMessage = 'Hello World';

  beforeEach(() => {
    pubSubTest = new PubSubTest();
  });

  afterAll(() => {
    pubSubTest.unsubscribeAll();
  });

  test('subscription callback must return sent value', () => {
    expect(pubSubTest).toBeInstanceOf(PubSubTest);
    expect(pubSubTest).toBeInstanceOf(PublishSubscribe);

    let messageReceived = '';

    pubSubTest.subscribe(PubSubTest.messageIds.message1, value => messageReceived = value);
    pubSubTest.sendMessage(PubSubTest.messageIds.message1, testMessage);

    expect(messageReceived).toEqual(testMessage);
  });

  test('subscription callback must not return sent value after unsubscribe is called', () => {
    expect(pubSubTest).toBeInstanceOf(PubSubTest);
    expect(pubSubTest).toBeInstanceOf(PublishSubscribe);

    let messageReceived = '';
    const subscriptionCallback = value => messageReceived = value;

    pubSubTest.subscribe(PubSubTest.messageIds.message1, subscriptionCallback.bind(this));
    pubSubTest.sendMessage(PubSubTest.messageIds.message1, testMessage);

    expect(messageReceived).toEqual(testMessage);

    messageReceived = '';
    pubSubTest.unsubscribe(PubSubTest.messageIds.message1, subscriptionCallback.bind(this));
    pubSubTest.sendMessage(PubSubTest.messageIds.message1, testMessage);

    expect(messageReceived).toEqual('');
  });

  test('subscription callback must only be called if not unsubscribed', () => {
    expect(pubSubTest).toBeInstanceOf(PubSubTest);
    expect(pubSubTest).toBeInstanceOf(PublishSubscribe);

    let messageReceived1 = '';
    let messageReceived2 = '';
    const subscriptionCallback1 = value => messageReceived1 = value;
    const subscriptionCallback2 = value => messageReceived2 = value;

    pubSubTest.subscribe(PubSubTest.messageIds.message1, subscriptionCallback1);
    pubSubTest.subscribe(PubSubTest.messageIds.message1, subscriptionCallback2);

    pubSubTest.unsubscribe(PubSubTest.messageIds.message1, subscriptionCallback1);
    pubSubTest.sendMessage(PubSubTest.messageIds.message1, testMessage);

    expect(messageReceived1).toEqual('');
    expect(messageReceived2).toEqual(testMessage);
  });

  test('subscription callback must return sent value after unsubscribe is called for an undefined subscription', () => {
    expect(pubSubTest).toBeInstanceOf(PubSubTest);
    expect(pubSubTest).toBeInstanceOf(PublishSubscribe);

    let messageReceived = '';
    const subscriptionCallback = value => messageReceived = value;

    messageReceived = '';
    pubSubTest.subscribe(PubSubTest.messageIds.message1, subscriptionCallback.bind(this));
    pubSubTest.unsubscribe(PubSubTest.messageIds.message2, subscriptionCallback.bind(this));
    pubSubTest.sendMessage(PubSubTest.messageIds.message1, testMessage);

    expect(messageReceived).toEqual(testMessage);
  });

  test('subscription callback must not return sent value after unsubscribeAll is called', () => {
    expect(pubSubTest).toBeInstanceOf(PubSubTest);
    expect(pubSubTest).toBeInstanceOf(PublishSubscribe);

    let messageReceived = '';
    const subscriptionCallback = value => messageReceived = value;

    pubSubTest.subscribe(PubSubTest.messageIds.message1, subscriptionCallback.bind(this));
    pubSubTest.sendMessage(PubSubTest.messageIds.message1, testMessage);

    expect(messageReceived).toEqual(testMessage);

    messageReceived = '';
    pubSubTest.clearAllSubscriptions();
    pubSubTest.sendMessage(PubSubTest.messageIds.message1, testMessage);

    expect(messageReceived).toEqual('');
  });

  test('subscription callback must return sent value for an undefined subscription id', () => {
    expect(pubSubTest).toBeInstanceOf(PubSubTest);
    expect(pubSubTest).toBeInstanceOf(PublishSubscribe);

    let messageReceived = '';
    const subscriptionCallback = value => messageReceived = value;

    pubSubTest.subscribe(undefined, subscriptionCallback.bind(this));
    pubSubTest.sendMessage(undefined, testMessage);

    expect(messageReceived).toEqual(testMessage);
  });

  test('subscription callback must not return sent value for an undefined subscription id after unsubscribe is called', () => {
    expect(pubSubTest).toBeInstanceOf(PubSubTest);
    expect(pubSubTest).toBeInstanceOf(PublishSubscribe);

    let messageReceived = '';
    const subscriptionCallback = value => messageReceived = value;

    pubSubTest.subscribe(undefined, subscriptionCallback.bind(this));
    pubSubTest.unsubscribe(undefined, subscriptionCallback.bind(this));
    pubSubTest.sendMessage(undefined, testMessage);

    expect(messageReceived).toEqual('');
  });
});
