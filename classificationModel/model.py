import numpy as np
from tensorflow import keras
from tensorflow.keras import layers

def loadMNIST():
    num_classes = 10
    input_shape = (28, 28, 1)

    (x_train, y_train), (x_test, y_test) = keras.datasets.mnist.load_data()

    x_train = x_train.astype("float32") / 255
    x_test = x_test.astype("float32") / 255

    x_train = np.expand_dims(x_train, -1)
    x_test = np.expand_dims(x_test, -1)

    y_train = keras.utils.to_categorical(y_train, num_classes)
    y_test = keras.utils.to_categorical(y_test, num_classes)

    return x_train, y_train, x_test, y_test

def createModel():
    model = keras.models.Sequential()
    model.add(keras.layers.Conv2D(
        filters=32, 
        kernel_size=(5,5),
        strides=1, 
        activation='relu',
        kernel_regularizer = keras.regularizers.l2(0.0005),
        input_shape=(28,28,1), 
        name = 'convolution_1'
    ))
    model.add(keras.layers.Conv2D(
        filters=32, 
        kernel_size=(5,5),
        strides=1, 
        activation='relu',
        use_bias=False,
        name = 'convolution_2'
    ))
    model.add(keras.layers.BatchNormalization(name='batchnorm_1'))
    model.add(keras.layers.Activation('relu'))
    model.add(keras.layers.MaxPooling2D(
        pool_size=(2,2), 
        strides=2, 
        name='max_pool_1'
    ))
    model.add(keras.layers.Dropout(0.25, name='dropout_1'))
    model.add(keras.layers.Conv2D(
        filters=64, 
        kernel_size=(3,3),
        strides=1, 
        activation='relu',
        kernel_regularizer = keras.regularizers.l2(0.0005),
        name = 'convolution_3'
    ))
    model.add(keras.layers.Conv2D(
        filters=64, 
        kernel_size=(3,3),
        strides=1, 
        activation='relu',
        use_bias=False,
        name = 'convolution_4'
    ))
    model.add(keras.layers.BatchNormalization(name='batchnorm_2'))
    model.add(keras.layers.Activation('relu'))
    model.add(keras.layers.MaxPooling2D(
        pool_size=(2,2), 
        strides=2, 
        name='max_pool_2'
    ))
    model.add(keras.layers.Dropout(0.25, name='dropout_2')) 
    model.add(keras.layers.Flatten(name='flatten'))
    model.add(keras.layers.Dense(
        units=256, 
        activation='relu',
        use_bias=False,
        name='fully_connected_1'
    ))
    model.add(keras.layers.BatchNormalization(name='batchnorm_3'))
    model.add(keras.layers.Activation('relu'))
    model.add(keras.layers.Dense(
        units=128, 
        activation='relu',
        use_bias=False,
        name='fully_connected_2'
    ))
    model.add(keras.layers.BatchNormalization(name='batchnorm_4'))
    model.add(keras.layers.Activation('relu'))
    model.add(keras.layers.Dense(
        units=84, 
        activation='relu',
        use_bias=False,
        name='fully_connected_3'
    ))
    model.add(keras.layers.BatchNormalization(name='batchnorm_5'))
    model.add(keras.layers.Activation('relu'))
    model.add(keras.layers.Dropout(0.25, name='dropout_3'))
    model.add(keras.layers.Dense(
        units=10, 
        activation='softmax', 
        name='output'
    ))

    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.01), 
        loss='categorical_crossentropy', 
        metrics=['accuracy']
    )

    return model

def trainModel(x_train, y_train, x_test, y_test):
    model = createModel()

    model.fit(
            x_train, 
            y_train, 
            epochs=30, 
            batch_size=64, 
            validation_split=0.2, 
            verbose=1, 
            shuffle=True,
            callbacks = [keras.callbacks.ReduceLROnPlateau(
                monitor='val_loss', 
                factor = 0.2, 
                patience = 2
            )]
        )
    score = model.evaluate(x_test, y_test, verbose=0)
    print("Test loss:", score[0])
    print("Test accuracy:", score[1])

    model.save('classificationModel/mnist_model.h5')

def runTrainSeq():
     x_train, y_train, x_test, y_test = loadMNIST()

     trainModel(x_train, y_train, x_test, y_test)

runTrainSeq()