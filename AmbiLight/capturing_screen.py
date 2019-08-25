import numpy as np
import cv2
import pyscreenshot as ImageGrab

while True:
    try:
        img = ImageGrab.grab()
    except AttributeError as e:
        print('Error: ' + str(e))
        break

    img_np = np.array(img)
    print(img_np)
    #
    # cv2.imshow("Screen", img_np)
    #
    # if cv2.waitKey(1) == 27:
    #     break

#cv2.destroyAllWindows()
