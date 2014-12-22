__author__ = 'knightingal'

import PyHTTPServer
import os
RootDir = "/home/knightingal/DevTools/.mix/1002/"
import json

def concat_files(root, files):
    file_content_s = []
    file_length_s = []
    for file_name in files:
        if file_name.split(".")[-1] != "jpg":
            continue
        fp = open(root + "/" + file_name, "r")
        file_content = fp.read()
        file_content_s.append(file_content)
        file_length_s.append({file_name: len(file_content)})
        fp.close()

    header = json.dumps(file_length_s)
    header_length = "%08d" % (len(header))
    concat_file_name = root.split('/')[-1]
    fp = open(root + "/" + concat_file_name, "w")
    fp.write(header_length)
    fp.write(header)
    for file_content in file_content_s:
        fp.write(file_content)
    fp.close()


def concat_img_in_dir(dir_str):
    for root, dirs, files in os.walk(dir_str):
        if root == dir_str:
            pass
        else:
            print root + str(files)
            concat_files(root, files)


if __name__ == "__main__":
    concat_img_in_dir(RootDir)